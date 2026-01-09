'use client';

import { Box, Paper, Stack, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import type { Buch } from '@/lib/books';
import { bookCoverUrl } from '@/lib/books';

function formatEuro(value: unknown): string {
  if (value === null || value === undefined) return '-';
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  if (Number.isNaN(n)) return String(value);
  return n.toFixed(2).replace('.', ',');
}

function formatPercent(value: unknown): string {
  if (value === null || value === undefined) return '-';
  const n = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
  if (Number.isNaN(n)) return String(value);

  return (n * 100).toFixed(2).replace('.', ',');
}

function formatDate(value: unknown): string {
  if (!value) return '-';
  const s = String(value);
  return s.includes('T') ? s.split('T')[0] : s;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="baseline">
      <Typography sx={{ fontWeight: 800, minWidth: 110 }}>{label}</Typography>
      <Typography sx={{ color: 'text.primary' }}>{value}</Typography>
    </Stack>
  );
}

export function BookDetailCard({ buch }: { buch: Buch }) {
  const title = buch.titel?.titel ?? '—';

  return (
    <Paper
      elevation={6}
      sx={{
        width: 'min(1200px, 92vw)',
        borderRadius: 2,
        bgcolor: '#E9F1FA',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 520px' },
          gap: { xs: 3, md: 6 },
          alignItems: 'center',
        }}
      >
        <Box sx={{ pl: { md: 2 } }}>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
            {title}
          </Typography>

          <Rating value={buch.rating ?? 0} readOnly max={5} sx={{ mb: 2 }} />

          <Stack spacing={1.5}>
            <Row label="ISBN:" value={buch.isbn ?? '-'} />
            <Row label="ART:" value={buch.art ?? '-'} />
            <Row label="PREIS:" value={`${formatEuro(buch.preis)} €`} />
            <Row label="RABATT:" value={`${formatPercent(buch.rabatt)} %`} />
            <Row label="LIEFERBAR:" value={buch.lieferbar ? 'Ja' : 'Nein'} />
            <Row label="DATUM:" value={formatDate(buch.datum)} />

            {buch.homepage ? (
              <Row
                label="HOMEPAGE:"
                value={
                  <Typography
                    component="a"
                    href={buch.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                      wordBreak: 'break-all',
                    }}
                  >
                    {buch.homepage}
                  </Typography>
                }
              />
            ) : null}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={bookCoverUrl(buch.id)}
            alt={title}
            sx={{
              width: { xs: 'min(420px, 80vw)', md: 420 },
              height: { xs: 'auto', md: 420 },
              objectFit: 'cover',
              borderRadius: 1,
              bgcolor: 'white',
              boxShadow: 2,
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
