// Accepts: 07XXXXXXXX, 256XXXXXXXXX, +256XXXXXXXXX
// Normalizes everything to +256XXXXXXXXX for storage.
export function normalizeUgandaPhone(input) {
  if (!input) return null;
  const digits = input.replace(/[^\d]/g, '');

  if (digits.startsWith('256') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return `+256${digits.slice(1)}`;
  }
  return null; // invalid format
}