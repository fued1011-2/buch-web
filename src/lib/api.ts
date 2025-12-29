import { TokenResponse } from "./auth";

export async function login(username: string, password: string) {
  const res = await fetch('/api/backend/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Benutzername oder Passwort sind falsch.');
    throw new Error(`Login fehlgeschlagen (${res.status})`);
  }

  return (await res.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
  };
}
