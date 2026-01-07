'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Pagination, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { useAuth } from '@/context/AuthContext';
import type { Buchart, Buch, Page } from '@/lib/books';
import { searchBooks } from '@/lib/books';
import { BookCard } from '@/components/BookCard';

const ART_OPTIONS: Buchart[] = ['EPUB', 'HARDCOVER', 'PAPERBACK'];

export default function BooksPage() {
  const { accessToken } = useAuth();

  const [titel, setTitel] = useState('');
  const [isbn, setIsbn] = useState('');
  const [art, setArt] = useState<Buchart | ''>('');
  const [lieferbar, setLieferbar] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const [pageUi, setPageUi] = useState(1);
  const [data, setData] = useState<Page<Buch> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(() => {
    return data?.page.totalPages ?? 1;
  }, [data]);

  const searchParams = useSearchParams();

  type QuickSearch = { titel?: string; isbn?: string };

  useEffect(() => {
    const q = searchParams.get('q')?.trim() ?? '';
    const mode = searchParams.get('mode');

    if (!q || (mode !== 'title' && mode !== 'isbn')) return;

    if (mode === 'title') {
      setTitel(q);
      setIsbn('');
      void runSearch(1, { titel: q, isbn: '' });
    } else {
      setIsbn(q);
      setTitel('');
      void runSearch(1, { isbn: q, titel: '' });
    }
  }, []);


  async function runSearch(nextPageUi = 1, quick?: QuickSearch) {
    setLoading(true);
    setError(null);

    const titelToUse = quick?.titel ?? titel;
    const isbnToUse = quick?.isbn ?? isbn;

    try {
      const res = await searchBooks(
        {
          titel: titelToUse.trim() || undefined,
          isbn: isbnToUse.trim() || undefined,
          art: art || undefined,
          lieferbar: lieferbar ? true : undefined,
          rating,
          page: nextPageUi + 1,
          size: 10,
        },
        accessToken ?? undefined,
      );

      setData(res);
      setPageUi(nextPageUi);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setTitel('');
    setIsbn('');
    setArt('');
    setLieferbar(false);
    setRating(null);
    setPageUi(1);
    setData(null);
    setError(null);
  }

  return (
    <Box sx={{ pl: { xs: 2, md: 6 }, pr: 2, pb: 6 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '420px 1fr' }, gap: 4, alignItems: 'start' }}>
        <Box sx={{ position: { md: 'sticky' }, top: 96, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 120px)' }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Suchfilter festlegen
          </Typography>

          <Typography sx={{ mb: 2, color: 'text.secondary', maxWidth: 360 }}>
            Sie können mehrere Suchfilter gleichzeitig festlegen
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button variant="text" onClick={reset} sx={{ textDecoration: 'underline' }}>
              ZURÜCKSETZEN
            </Button>
          </Box>

          <Stack spacing={2}>
            <TextField label="Titel" value={titel} onChange={(e) => setTitel(e.target.value)} />

            <TextField label="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />

            <FormControl>
              <InputLabel id="art-label">Art</InputLabel>
              <Select labelId="art-label" label="Art" value={art} onChange={(e) => setArt(e.target.value as Buchart | '')}>
                <MenuItem value="">(egal)</MenuItem>
                {ART_OPTIONS.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <FormControlLabel
                control={<Checkbox checked={lieferbar} onChange={(e) => setLieferbar(e.target.checked)} />}
                label="Buch ist lieferbar"
              />
            </Paper>

            <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                value={rating ?? 0}
                onChange={(_, v) => setRating(v)}
                max={5}
              />
              <Typography sx={{ textDecoration: 'underline' }}>Rating</Typography>
              {rating !== null ? (
                <Button size="small" variant="text" onClick={() => setRating(null)}>
                  löschen
                </Button>
              ) : null}
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button variant="contained" onClick={() => runSearch(1)} disabled={loading}>
                {loading ? 'Lädt...' : 'Anwenden'}
              </Button>
            </Box>

            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </Box>

        <Box>
          <Stack
            spacing={3}
            sx={{
              maxWidth: 1100,
              mx: 'auto',
            }}
          >
            {(data?.content ?? []).map((b) => (
              <BookCard key={b.id} buch={b} />
            ))}

            {data && totalPages > 1 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={pageUi}
                  onChange={(_, p) => runSearch(p)}
                />
              </Box>
            ) : null}

            {data && (data.content?.length ?? 0) === 0 ? (
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Keine Treffer
                </Typography>
                <Typography color="text.secondary">
                  Zu deinen Suchfiltern wurden keine Bücher gefunden. Bitte ändere die Filter und versuche es erneut.
                </Typography>
              </Paper>
          ) : null}

            {!data ? (
              <Typography sx={{ color: 'text.secondary' }}>
                Setze Filter und klicke „Anwenden“, um Bücher zu laden.
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
