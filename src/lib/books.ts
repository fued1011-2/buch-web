export type Buchart = 'EPUB' | 'HARDCOVER' | 'PAPERBACK';

export type Titel = {
  titel: string;
  untertitel?: string;
};

export type Buch = {
  id: number;
  isbn: string;
  preis: number;
  rabatt?: number | undefined;
  rating: number;
  art?: Buchart | undefined;
  lieferbar?: boolean;
  datum?: Date | string | undefined;
  homepage?: string | undefined;
  titel?: Titel | undefined;
};

export type Page<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type BuchSearchParams = {
  titel?: string;
  isbn?: string;
  art?: Buchart | '';
  lieferbar?: boolean;
  rating?: number | undefined;
  page?: number;
  size?: number;
};

export type BuchCreateInput = {
  titel: string;
  isbn: string;
  preis: number;
  rabatt?: number | undefined;
  homepage?: string | undefined;
  datum?: string | undefined;
  rating: number;
  lieferbar?: boolean;
  art?: Buchart | undefined;
};

function buildQuery(params: BuchSearchParams) {
  const q = new URLSearchParams();

  if (params.titel) q.set('titel', params.titel);
  if (params.isbn) q.set('isbn', params.isbn);
  if (params.art) q.set('art', params.art);
  if (params.lieferbar !== undefined) q.set('lieferbar', String(params.lieferbar));
  if (params.rating !== null && params.rating !== undefined) q.set('rating', String(params.rating));

  const size = params.size ?? 10;
  const pageUi = params.page ?? 1;
  const pageBackend = Math.max(0, pageUi - 1);

  q.set('size', String(size));
  q.set('page', String(pageBackend));

  return q.toString();
}

function apiBase(): string {
  return '/api/backend';
}

function authHeaders(accessToken?: string): Record<string, string> {
  return accessToken ? { authorization: `Bearer ${accessToken}` } : {};
}

function extractIdFromLocation(location: string | null): number | null {
  if (!location) return null;
  const m = location.match(/\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

function toIsoDate(date: string | undefined) {
  if (!date) return undefined;
  return new Date(date).toISOString();
}

export async function searchBooks(params: BuchSearchParams, token?: string) {
  const qs = buildQuery(params);
  const res = await fetch(`/api/backend/rest?${qs}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  });

   if (res.status === 404) {
    const size = params.size ?? 10;
    const number = (params.page ?? 1) - 1;

    return {
      content: [],
      page: {
        size,
        number,
        totalElements: 0,
        totalPages: 0,
      },
    };
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`searchBooks failed: ${res.status} ${text}`);
  }

  return (await res.json()) as Page<Buch>;
}

export async function getBookById(id: number, accessToken?: string): Promise<Buch> {
  const res = await fetch(`/api/backend/rest/${id}`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getBookById failed: ${res.status} ${text}`);
  }

  return (await res.json()) as Buch;
}

export async function createBook(input: BuchCreateInput, accessToken?: string): Promise<Buch> {
  const res = await fetch(`${apiBase()}/rest`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...authHeaders(accessToken),
    },
    body: JSON.stringify({
      isbn: input.isbn,
      rating: input.rating,
      art: input.art ?? undefined,
      preis: input.preis,
      rabatt: input.rabatt ?? undefined,
      lieferbar: input.lieferbar ?? undefined,
      datum: toIsoDate(input.datum ?? undefined),
      homepage: input.homepage ?? undefined,
      titel: { titel: input.titel },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`createBook failed: ${res.status} ${text}`);
  }

  const id = extractIdFromLocation(res.headers.get('location'));
  if (id == null) {
    throw new Error('createBook succeeded, but Location header is missing or does not contain an id');
  }

  return await getBookById(id, accessToken);
}

export function bookCoverUrl(id: number) {
  return `/api/backend/rest/file/${id}`;
}
