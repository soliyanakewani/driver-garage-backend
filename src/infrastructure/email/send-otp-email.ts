import nodemailer from 'nodemailer';

/** Strip accidental line breaks (common when pasting secrets into Render multiline fields). */
function smtpEnv(key: 'SMTP_HOST' | 'SMTP_PORT' | 'SMTP_USER' | 'SMTP_PASS' | 'MAIL_FROM'): string {
  const v = process.env[key];
  if (v == null) return '';
  return v.replace(/\r?\n/g, '').trim();
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

export async function sendGarageSignupOtpEmail(to: string, code: string): Promise<void> {
  const subject = 'Your garage signup verification code';
  const text = `Your verification code is: ${code}\n\nIt expires in 10 minutes. If you did not request this, ignore this email.`;

  if (!smtpConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM to send OTP emails.'
      );
    }
    console.warn(`[dev] Garage signup OTP for ${to}: ${code}`);
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
  await transporter.sendMail({
    from: smtpEnv('MAIL_FROM'),
    to,
    subject,
    text,
  });
  console.log('[garage-otp] smtp sendMail done');
}
