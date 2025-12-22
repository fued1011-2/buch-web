import { TokenResponse } from "./auth";

export async function login(username: string, password: string): Promise<TokenResponse> {
  const res = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Benutzername oder Passwort sind falsch.');
    const text = await res.text().catch(() => '');
    throw new Error(text || `Login fehlgeschlagen (${res.status})`);
  }

  return (await res.json()) as TokenResponse;
}
