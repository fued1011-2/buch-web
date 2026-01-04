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
  rating?: number | null;
  page?: number;
  size?: number;
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

export async function searchBooks(params: BuchSearchParams, token?: string) {
  const qs = buildQuery(params);
  const res = await fetch(`/api/backend/rest?${qs}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`searchBooks failed: ${res.status} ${text}`);
  }

  return (await res.json()) as Page<Buch>;
}

export function bookCoverUrl(id: number) {
  return `/api/backend/rest/file/${id}`;
}
