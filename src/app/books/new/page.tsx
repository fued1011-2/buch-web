'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';

import { useAuth } from '@/context/AuthContext';
import type { Buchart } from '@/lib/books';
import { createBook } from '@/lib/books';
import { BookCreateCard } from '@/components/BookCreateCard';

type FieldName = 'titel' | 'isbn' | 'preis' | 'rabatt' | 'homepage' | 'datum' | 'rating';
type FieldErrors = Partial<Record<FieldName, string>>;
type Touched = Partial<Record<FieldName, boolean>>;

function isValidIsbn13(value: string): boolean {
  const cleaned = value.replace(/[-\s]/g, '');
  if (!/^\d{13}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const d = Number(cleaned[i]);
    sum += i % 2 === 0 ? d : d * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(cleaned[12]);
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function mapCreateError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes('403')) return 'Du hast keine Berechtigung, ein Buch anzulegen.';
  if (msg.includes('422')) return 'Die ISBN existiert bereits.';

  return 'Speichern fehlgeschlagen. Bitte versuche es erneut.';
}

const ART_OPTIONS: Buchart[] = ['EPUB', 'HARDCOVER', 'PAPERBACK'];

export default function NewBookPage() {
  const router = useRouter();
  const { accessToken, isAdmin } = useAuth();

  const [titel, setTitel] = useState('');
  const [isbn, setIsbn] = useState('');
  const [preis, setPreis] = useState('');
  const [rabatt, setRabatt] = useState('');
  const [homepage, setHomepage] = useState('');

  const [datum, setDatum] = useState('');
  const [rating, setRating] = useState<number | null>(0);
  const [lieferbar, setLieferbar] = useState(false);
  const [art, setArt] = useState<Buchart | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [touched, setTouched] = useState<Touched>({});
  const markTouched = (name: FieldName) => setTouched((t) => ({ ...t, [name]: true }));

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

  const fieldErrors: FieldErrors = useMemo(() => {
    const errs: FieldErrors = {};

    if (!titel.trim()) errs.titel = 'Titel ist ein Pflichtfeld.';

    const isbnTrimmed = isbn.trim();
    if (!isbnTrimmed) {
      errs.isbn = 'ISBN ist ein Pflichtfeld.';
    } else if (!isValidIsbn13(isbnTrimmed)) {
      errs.isbn = 'Bitte eine gültige ISBN-13 eingeben (z.B. 978-3-897-22583-1).';
    }

    if (!preis.trim()) {
      errs.preis = 'Preis ist ein Pflichtfeld.';
    } else if (!Number.isFinite(preisNumber) || preisNumber <= 0) {
      errs.preis = 'Preis muss eine positive Zahl sein.';
    }

    if (rabatt.trim()) {
      if (Number.isNaN(rabattDecimal as unknown as number)) {
        errs.rabatt = 'Rabatt muss eine Zahl sein (z.B. 10 für 10%).';
      } else if (rabattDecimal != null && (rabattDecimal < 0 || rabattDecimal > 1)) {
        errs.rabatt = 'Rabatt muss zwischen 0 und 100 liegen.';
      }
    }

    if (homepage.trim() && !isValidUrl(homepage.trim())) {
      errs.homepage = 'Bitte eine gültige URL angeben (http/https).';
    }

    if (rating == null) {
      errs.rating = 'Bitte ein Rating wählen.';
    } else if (rating < 0 || rating > 5) {
      errs.rating = 'Rating muss zwischen 0 und 5 liegen.';
    }

    return errs;
  }, [titel, isbn, preis, preisNumber, rabatt, rabattDecimal, homepage, datum, rating]);

  const canSubmit = useMemo(() => {
    if (!isAdmin) return false;
    return Object.keys(fieldErrors).length === 0;
  }, [isAdmin, fieldErrors]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    setTouched({
      titel: true,
      isbn: true,
      preis: true,
      rabatt: true,
      homepage: true,
      datum: true,
      rating: true,
    });

    if (!canSubmit) {
      setError('Bitte markierte Felder korrigieren.');
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
      setError(mapCreateError(err));
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
        setTitel={(v) => {
          setTitel(v);
        }}
        isbn={isbn}
        setIsbn={(v) => {
          setIsbn(v);
        }}
        preis={preis}
        setPreis={(v) => {
          setPreis(v);
        }}
        rabatt={rabatt}
        setRabatt={(v) => {
          setRabatt(v);
        }}
        homepage={homepage}
        setHomepage={(v) => {
          setHomepage(v);
        }}
        datum={datum}
        setDatum={(v) => {
          setDatum(v);
        }}
        rating={rating}
        setRating={(v) => {
          setRating(v);
          markTouched('rating');
        }}
        lieferbar={lieferbar}
        setLieferbar={setLieferbar}
        art={art}
        setArt={setArt}
        artOptions={ART_OPTIONS}
        loading={loading}
        canSubmit={canSubmit}
        error={error}
        onSubmit={onSubmit}
        dateInputRef={dateInputRef}
        touched={touched}
        markTouched={markTouched}
        fieldErrors={fieldErrors}
      />
    </Box>
  );
}
