'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';

import { useAuth } from '@/context/AuthContext';
import type { Buchart } from '@/lib/books';
import { createBook } from '@/lib/books';
import { BookCreateCard } from '@/components/BookCreateCard';

export default function NewBookPage() {
  const router = useRouter();
  const { accessToken, isAdmin } = useAuth();

  const [titel, setTitel] = useState('');
  const [isbn, setIsbn] = useState('');
  const [preis, setPreis] = useState('');
  const [rabatt, setRabatt] = useState('');
  const [homepage, setHomepage] = useState('');

  const [datum, setDatum] = useState(''); // "YYYY-MM-DD"
  const [rating, setRating] = useState<number | null>(0);
  const [lieferbar, setLieferbar] = useState(false);
  const [art, setArt] = useState<Buchart | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const preisNumber = useMemo(() => {
    const p = preis.trim();
    if (!p) return NaN;
    return Number(p.replace(',', '.'));
  }, [preis]);

  const rabattDecimal = useMemo(() => {
    const r = rabatt.trim();
    if (!r) return null;
    const n = Number(r.replace(',', '.'));
    if (!Number.isFinite(n)) return NaN;
    return n / 100;
  }, [rabatt]);

  const canSubmit = useMemo(() => {
    if (!isAdmin) return false;
    if (!titel.trim()) return false;
    if (!isbn.trim()) return false;
    if (!Number.isFinite(preisNumber) || preisNumber <= 0) return false;
    if (rating == null) return false;
    if (Number.isNaN(rabattDecimal as unknown as number)) return false;
    if (rabattDecimal != null && (rabattDecimal < 0 || rabattDecimal > 1)) return false;
    return true;
  }, [isAdmin, titel, isbn, preisNumber, rating, rabattDecimal]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError('Bitte Pflichtfelder korrekt ausfüllen.');
      return;
    }

    setLoading(true);
    try {
      const created = await createBook(
        {
          titel: titel.trim(),
          isbn: isbn.trim(),
          preis: preisNumber,
          rabatt: rabattDecimal ?? undefined,
          homepage: homepage.trim() || undefined,
          datum: datum,
          rating: rating ?? 0,
          lieferbar,
          art: art || undefined,
        },
        accessToken ?? undefined,
      );

      router.replace(`/books/${created.id}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        px: 2,
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h3" align="center" sx={{ fontWeight: 800, mt: 4, mb: 3 }}>
        Neues Buch anlegen
      </Typography>

      <BookCreateCard
        isAdmin={isAdmin}
        titel={titel}
        setTitel={setTitel}
        isbn={isbn}
        setIsbn={setIsbn}
        preis={preis}
        setPreis={setPreis}
        rabatt={rabatt}
        setRabatt={setRabatt}
        homepage={homepage}
        setHomepage={setHomepage}
        datum={datum}
        setDatum={setDatum}
        rating={rating}
        setRating={setRating}
        lieferbar={lieferbar}
        setLieferbar={setLieferbar}
        art={art}
        setArt={setArt}
        loading={loading}
        canSubmit={canSubmit}
        error={error}
        onSubmit={onSubmit}
        dateInputRef={dateInputRef}
      />
    </Box>
  );
}
