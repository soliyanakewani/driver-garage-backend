/** Thrown when outbound SMTP (e.g. Brevo) fails so handlers can map to 503 with a reliable type check. */
export class MailSendError extends Error {
  override readonly name = 'MailSendError';

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
