const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include', // send and store cookies across the client/server origins
  });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message || 'Something went wrong. Please try again.');
  }
  return body.data;
}

export async function apiPost(path, payload, idempotencyKey) {
  const headers = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    credentials: 'include', // send and store cookies across the client/server origins
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.error?.message || 'Something went wrong. Please try again.');
  }
  return body.data;
}