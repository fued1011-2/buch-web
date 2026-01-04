import { NextResponse, type NextRequest } from 'next/server';

function getBackendBaseUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) throw new Error('BACKEND_URL is missing');
  return url;
}

async function proxy(req: NextRequest, path: string[]) {
  const target = `${getBackendBaseUrl()}/${path.join('/')}${req.nextUrl.search}`;

  const headers = new Headers();
  const ct = req.headers.get('content-type');
  if (ct) headers.set('content-type', ct);

  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);

  headers.set('accept', req.headers.get('accept') ?? '*/*');

  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body,
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete('content-encoding');

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
