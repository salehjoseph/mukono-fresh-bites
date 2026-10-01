import argon2 from 'argon2';

// Argon2id, OWASP's current recommended password hashing algorithm.
// These cost parameters follow OWASP's minimum recommendation for argon2id.
const HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plainPassword) {
  return argon2.hash(plainPassword, HASH_OPTIONS);
}

export async function verifyPassword(hash, plainPassword) {
  try {
    return await argon2.verify(hash, plainPassword);
  } catch {
    return false; // malformed hash or verification error — treat as "wrong password", not a crash
  }
}