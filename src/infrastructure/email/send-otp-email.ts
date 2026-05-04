import nodemailer from 'nodemailer';
import { MailSendError } from './mail-send.error';

const BREVO_TRANSACTIONAL_URL = 'https://api.brevo.com/v3/smtp/email';

function formatSmtpFailure(e: unknown): string {
  if (e instanceof Error) {
    const ne = e as Error & {
      response?: string;
      responseCode?: number;
      command?: string;
    };
    const parts = [ne.message];
    if (ne.response) parts.push(String(ne.response));
    if (ne.responseCode != null) parts.push(`smtp=${ne.responseCode}`);
    if (ne.command) parts.push(`cmd=${ne.command}`);
    return parts.filter(Boolean).join(' | ');
  }
  return String(e);
}

/** Strip accidental line breaks (common when pasting secrets into Render multiline fields). */
function smtpEnv(key: 'SMTP_HOST' | 'SMTP_PORT' | 'SMTP_USER' | 'SMTP_PASS' | 'MAIL_FROM'): string {
  const v = process.env[key];
  if (v == null) return '';
  return v.replace(/\r?\n/g, '').trim();
}

function brevoApiKey(): string {
  return (process.env.BREVO_API_KEY ?? '').replace(/\r?\n/g, '').trim();
}

function smtpConfigured(): boolean {
  return Boolean(
    smtpEnv('SMTP_HOST') &&
      smtpEnv('SMTP_PORT') &&
      smtpEnv('SMTP_USER') &&
      smtpEnv('SMTP_PASS') &&
      smtpEnv('MAIL_FROM')
  );
}

/** Render free tier blocks outbound SMTP (25/465/587). HTTPS API on 443 works. */
function resolveTransport(): 'brevo-api' | 'smtp' | null {
  if (brevoApiKey() && smtpEnv('MAIL_FROM')) return 'brevo-api';
  if (smtpConfigured()) return 'smtp';
  return null;
}

/** Parses `Name <email@x.com>` or plain `email@x.com` for Brevo sender. */
function parseMailFrom(from: string): { name?: string; email: string } {
  const t = from.trim();
  const lastLt = t.lastIndexOf('<');
  const lastGt = t.lastIndexOf('>');
  if (lastLt !== -1 && lastGt > lastLt) {
    const email = t.slice(lastLt + 1, lastGt).trim();
    let name = t.slice(0, lastLt).trim().replace(/^["']|["']$/g, '').trim();
    return name ? { name, email } : { email };
  }
  return { email: t };
}

async function sendViaBrevoHttpApi(to: string, subject: string, textContent: string): Promise<void> {
  const sender = parseMailFrom(smtpEnv('MAIL_FROM'));
  if (!sender.email) {
    throw new MailSendError('Email delivery failed: MAIL_FROM is empty or invalid.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    console.log('[garage-otp] brevo API send start');
    const res = await fetch(BREVO_TRANSACTIONAL_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoApiKey(),
      },
      body: JSON.stringify({
        sender: sender.name ? { name: sender.name, email: sender.email } : { email: sender.email },
        to: [{ email: to }],
        subject,
        textContent,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new MailSendError(
        `Email delivery failed: Brevo API HTTP ${res.status}${body ? ` — ${body.slice(0, 500)}` : ''}`
      );
    }
    console.log('[garage-otp] brevo API send done');
  } catch (e: unknown) {
    if (e instanceof MailSendError) throw e;
    const msg =
      e instanceof Error
        ? e.name === 'AbortError'
          ? 'Brevo API request timed out'
          : e.message
        : String(e);
    console.error('[garage-otp] brevo API failed', msg);
    throw new MailSendError(`Email delivery failed: ${msg}`, { cause: e });
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendGarageSignupOtpEmail(to: string, code: string): Promise<void> {
  const subject = 'Your garage signup verification code';
  const text = `Your verification code is: ${code}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`;

  const mode = resolveTransport();

  if (mode === null) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Email is not configured. On Render free tier, outbound SMTP is blocked — set BREVO_API_KEY and MAIL_FROM (Brevo transactional API over HTTPS). Alternatively use full SMTP_* on a host that allows ports 587/465.'
      );
    }
    console.warn(`[dev] Garage signup OTP for ${to}: ${code}`);
    return;
  }

  if (mode === 'brevo-api') {
    await sendViaBrevoHttpApi(to, subject, text);
    return;
  }

  const port = Number(smtpEnv('SMTP_PORT'));
  const host = smtpEnv('SMTP_HOST');
  const transporter = nodemailer.createTransport({
    host,
    port: Number.isFinite(port) ? port : 587,
    secure: port === 465,
    auth: {
      user: smtpEnv('SMTP_USER'),
      pass: smtpEnv('SMTP_PASS'),
    },
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 25_000,
  });

  console.log('[garage-otp] smtp sendMail start');
  try {
    await transporter.sendMail({
      from: smtpEnv('MAIL_FROM'),
      to,
      subject,
      text,
    });
  } catch (e: unknown) {
    console.error('[garage-otp] smtp sendMail failed', formatSmtpFailure(e));
    throw new MailSendError(`Email delivery failed: ${formatSmtpFailure(e)}`, { cause: e });
  }
  console.log('[garage-otp] smtp sendMail done');
}
