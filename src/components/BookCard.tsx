'use client';

import Link from 'next/link';
import { Box, Button, Card, CardContent, Rating, Typography } from '@mui/material';
import type { Buch } from '@/lib/books';
import { bookCoverUrl } from '@/lib/books';

type Props = {
  buch: Buch;
};

export function BookCard({ buch }: Props) {
  const title = buch.titel?.titel ?? '(ohne Titel)';

  return (
    <Card
      sx={{
        bgcolor: '#EAF2FB',
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
      }}
    >
      <Box
        component="img"
        src={bookCoverUrl(buch.id)}
        alt={title}
        sx={{
          width: 160,
          height: 160,
          objectFit: 'cover',
          borderRadius: 1,
          bgcolor: 'white',
        }}
      />

      <CardContent sx={{ p: 0, flex: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {title}
        </Typography>

        {buch.preis ? (
          <Typography sx={{ mb: 1 }}>
            <b>PREIS:</b> {buch.preis}
          </Typography>
        ) : null}

        <Typography sx={{ mb: 1 }}>
          <b>ISBN:</b> {buch.isbn}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <b>ART:</b> {buch.art ?? '-'}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          <b>LIEFERBAR:</b> {buch.lieferbar ? 'Ja' : 'Nein'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Rating value={buch.rating ?? 0} readOnly />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button component={Link} href={`/books/${buch.id}`} variant="contained">
            DETAILS ANZEIGEN
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
