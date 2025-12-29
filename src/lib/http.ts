import { getAccessToken } from './auth';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

export async function fetchJson<T>(path: string, options: Options = {}): Promise<T> {
  const token = getAccessToken();

  const res = await fetch(`/api/backend/${path.replace(/^\//, '')}`, {
    method: options.method ?? 'GET',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new HttpError(res.status, text || res.statusText || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
