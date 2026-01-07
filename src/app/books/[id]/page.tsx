'use client';


import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import type { Buch } from '@/lib/books';
import { getBookById } from '@/lib/books';
import { BookDetailCard } from '@/components/BookDetailCard';

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const searchParams = useSearchParams();

  const [buch, setBuch] = useState<Buch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatedMsg, setShowCreatedMsg] = useState(false);


  const id = Number(params.id);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!Number.isFinite(id)) {
        setError('Ungültige Buch-ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      if (searchParams.get('created') === '1') {
        setShowCreatedMsg(true);
      }

      try {
        const data = await getBookById(id, accessToken ?? undefined);
        if (!cancelled) setBuch(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Buch konnte nicht geladen werden.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, accessToken, searchParams]);

  return (
    <Box sx={{ px: 2, pb: 6 }}>
      <Typography variant="h2" align="center" sx={{ fontWeight: 800, my: 4 }}>
        {showCreatedMsg ? 'Neues Buch erfolgreich angelegt!' : 'Detailansicht'}
      </Typography>

      <Box sx={{ width: 'min(1200px, 92vw)', mx: 'auto' }}>
        <Button
          variant="contained"
          onClick={() => router.back()}
          sx={{ mb: 3, width: 140 }}
        >
          ZURÜCK
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {loading ? (
          <Typography sx={{ color: 'text.secondary' }}>Lädt...</Typography>
        ) : error ? (
          <Box sx={{ width: 'min(1200px, 92vw)' }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : buch ? (
          <BookDetailCard buch={buch} />
        ) : (
          <Box sx={{ width: 'min(1200px, 92vw)' }}>
            <Alert severity="warning">Kein Buch gefunden.</Alert>
          </Box>
        )}
      </Box>
    </Box>
  );
}
