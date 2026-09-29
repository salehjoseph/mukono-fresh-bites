const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    const message = body?.error?.message || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return body.data;
}