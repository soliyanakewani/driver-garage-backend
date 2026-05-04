import nodemailer from 'nodemailer';

function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_PORT?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.MAIL_FROM?.trim()
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

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number.isFinite(port) ? port : 587,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  });
}
