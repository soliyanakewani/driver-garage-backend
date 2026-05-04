import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { MailSendError } from '../../../../infrastructure/email/mail-send.error';
import { GarageAuthService } from '../services/auth.service';
import { extractGarageBusinessDocumentUrl } from '../../common/extract-business-document-url';

const service = new GarageAuthService();

function authError(err: unknown): { message: string; status: number } {
  if (err instanceof Prisma.PrismaClientInitializationError) {
    return {
      message:
        'Database connection failed. Check DATABASE_URL (and DIRECT_URL if used) on the server.',
      status: 503,
    };
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[] | undefined)?.[0];
      if (target === 'email') return { message: 'Email already registered', status: 409 };
      if (target === 'phone') return { message: 'Phone number already registered', status: 409 };
      return { message: 'A record with this value already exists', status: 409 };
    }
    if (err.code === 'P2021' || err.code === 'P2022') {
      return {
        message:
          'Server database is missing required tables or columns. Run `npx prisma migrate deploy` against the production database (Render release phase or one-off shell).',
        status: 503,
      };
    }
    // Reachability / pool / timeout (common on cold Render + Supabase pooler)
    if (['P1001', 'P1002', 'P1008', 'P1017', 'P2024'].includes(err.code)) {
      return {
        message: `Database temporarily unavailable (${err.code}). Retry in a few seconds.`,
        status: 503,
      };
    }
    // Any other Prisma request error — do not fall through to generic 400
    return {
      message: `Database error (${err.code}). Run migrations (npx prisma migrate deploy) or check server logs.`,
      status: 503,
    };
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      message: 'Invalid data sent to the database. Check server logs.',
      status: 500,
    };
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return {
      message:
        'Database engine error. Ensure migrations ran (GarageSignupOtp) and DATABASE_URL is correct.',
      status: 503,
    };
  }
  if (err instanceof MailSendError) {
    return { message: err.message, status: 503 };
  }
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (
      msg.includes('email is not configured') ||
      (msg.includes('smtp') && msg.includes('not configured'))
    ) {
      return { message: err.message, status: 503 };
    }
    if (msg.includes('email already registered') || msg.includes('phone number already registered'))
      return { message: err.message, status: 409 };
    if (msg.includes('invalid credentials') || msg.includes('invalid or expired otp') || msg.includes('invalid otp'))
      return { message: err.message, status: 401 };
    if (
      msg.includes('otp expired') ||
      msg.includes('no garage found') ||
      msg.includes('email not verified') ||
      msg.includes('email verification expired')
    )
      return { message: err.message, status: 400 };
    // SMTP / relay failures from nodemailer (Brevo often uses 535 / "not accepted" without the phrases below)
    if (
      msg.includes('eauth') ||
      msg.includes('invalid login') ||
      msg.includes('authentication failed') ||
      msg.includes('not accepted') ||
      msg.includes('username and password') ||
      msg.includes('badcredentials') ||
      msg.includes('econnection') ||
      msg.includes('etimedout') ||
      msg.includes('greeting never received') ||
      msg.includes('self signed') ||
      msg.includes('certificate') ||
      msg.includes('tls') ||
      msg.includes('nodemailer') ||
      /\b5\d\d\b/.test(msg) ||
      msg.includes('5.7.') ||
      msg.includes('connection closed') ||
      msg.includes('socket hang up')
    ) {
      return { message: `Email delivery failed: ${err.message}`, status: 503 };
    }
    // Unmatched Error: surface message for debugging (e.g. Prisma edge cases, mail provider text)
    return { message: err.message || 'Unexpected server error', status: 500 };
  }
  return { message: 'Something went wrong. Please try again.', status: 500 };
}

export const signup = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({
        error: 'Request body is required. Use multipart/form-data or JSON with garage_name (or name), email, phone, password.',
      });
    }
    const name = (body.garage_name ?? body.name) as string | undefined;
    const email = body.email as string | undefined;
    const phone = body.phone_number ?? body.phone;
    const password = body.password as string | undefined;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        error: 'garage_name (or name), email, phone_number (or phone), and password are required.',
      });
    }
    const rawServices = body.services ?? body.services_offered;
    const services = Array.isArray(rawServices)
      ? rawServices.map((s: unknown) => (typeof s === 'string' ? s : (s as { name?: string })?.name ?? '')).filter(Boolean)
      : typeof rawServices === 'string'
        ? (() => {
            try {
              const parsed = JSON.parse(rawServices) as unknown;
              return Array.isArray(parsed) ? parsed.map((s: unknown) => (typeof s === 'string' ? s : (s as { name?: string })?.name ?? '')).filter(Boolean) : [];
            } catch {
              return rawServices.trim() ? [rawServices.trim()] : [];
            }
          })()
        : undefined;

    const rawLocation = body.garage_location ?? body.location;
    let location: { address?: string; latitude?: number; longitude?: number } | undefined;
    if (rawLocation) {
      const loc = typeof rawLocation === 'string' ? (() => { try { return JSON.parse(rawLocation); } catch { return {}; } })() : rawLocation;
      location = {
        address: loc.address ?? loc.formatted_address ?? undefined,
        latitude: loc.latitude != null ? Number(loc.latitude) : loc.lat != null ? Number(loc.lat) : undefined,
        longitude: loc.longitude != null ? Number(loc.longitude) : loc.lng != null ? Number(loc.lng) : undefined,
      };
    } else {
      const address = body.address as string | undefined;
      const latitude = body.latitude != null ? Number(body.latitude) : undefined;
      const longitude = body.longitude != null ? Number(body.longitude) : undefined;
      if (address || latitude != null || longitude != null) {
        location = { address, latitude, longitude };
      }
    }

    const businessDocumentUrl = extractGarageBusinessDocumentUrl(req);
    const { token, garage } = await service.signup(
      name,
      email,
      String(phone),
      password,
      services,
      location,
      businessDocumentUrl
    );
    const { password: _pw, ...safe } = garage as { password: string; [k: string]: unknown };
    res.status(201).json({ token, garage: safe });
  } catch (err: unknown) {
    const { message, status } = authError(err);
    return res.status(status).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ error: 'Request body is required. Send JSON with email and password.' });
    }
    const { email, password } = body;
    const result = await service.login(email, password);
    res.json(result);
  } catch (err: unknown) {
    const { message, status } = authError(err);
    return res.status(status).json({ error: message });
  }
};

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    const result = await service.sendOtp(email);
    res.json(result);
  } catch (err: unknown) {
    console.error('[garage-auth][send-otp]', err);
    const { message, status } = authError(err);
    return res.status(status).json({ error: message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body as { email: string; code: string };
    const result = await service.verifyOtp(email, code);
    res.json(result);
  } catch (err: unknown) {
    const { message, status } = authError(err);
    return res.status(status).json({ error: message });
  }
};