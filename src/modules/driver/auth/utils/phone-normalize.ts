/** Normalize phone for comparison/storage (digits only, keep leading country digits). */
export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}
