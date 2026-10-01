export function validatePasswordStrength(password) {
  if (!password || password.length < 12) {
    return 'Password must be at least 12 characters long.';
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include uppercase, lowercase, and a number.';
  }
  return null; // valid
}