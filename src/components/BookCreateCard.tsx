'use client';

import type { RefObject } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Rating from '@mui/material/Rating';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import type { Buchart } from '@/lib/books';

const ART_OPTIONS: Buchart[] = ['EPUB', 'HARDCOVER', 'PAPERBACK'];

type Props = {
  isAdmin: boolean;

  titel: string;
  setTitel: (v: string) => void;

  isbn: string;
  setIsbn: (v: string) => void;

  preis: string;
  setPreis: (v: string) => void;

  rabatt: string;
  setRabatt: (v: string) => void;

  homepage: string;
  setHomepage: (v: string) => void;

  datum: string;
  setDatum: (v: string) => void;

  rating: number | null;
  setRating: (v: number | null) => void;

  lieferbar: boolean;
  setLieferbar: (v: boolean) => void;

  art: Buchart | '';
  setArt: (v: Buchart | '') => void;

  loading: boolean;
  canSubmit: boolean;

  error: string | null;

  onSubmit: (e: React.FormEvent) => void;

  dateInputRef: RefObject<HTMLInputElement | null>;
};

export function BookCreateCard(props: Props) {
  const {
    isAdmin,
    titel,
    setTitel,
    isbn,
    setIsbn,
    preis,
    setPreis,
    rabatt,
    setRabatt,
    homepage,
    setHomepage,
    datum,
    setDatum,
    rating,
    setRating,
    lieferbar,
    setLieferbar,
    art,
    setArt,
    loading,
    canSubmit,
    error,
    onSubmit,
    dateInputRef,
  } = props;

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        pb: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 'min(1200px, 92vw)',
          bgcolor: '#E9F1FA',
          borderRadius: 2,
          p: { xs: 2.5, md: 4 },
        }}
      >
        {!isAdmin ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Du bist nicht als Admin eingeloggt. Das Anlegen wird vom Backend per 403 Forbidden abgelehnt.
          </Alert>
        ) : null}

        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 6 },
            alignItems: 'start',
          }}
        >
          <Stack spacing={3}>
            <TextField
              label="Titel *"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="ISBN *"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Preis *"
              value={preis}
              onChange={(e) => setPreis(e.target.value)}
              required
              fullWidth
              inputMode="decimal"
            />
            <TextField
              label="Rabatt"
              value={rabatt}
              onChange={(e) => setRabatt(e.target.value)}
              fullWidth
              inputMode="decimal"
              helperText="in Prozent (z.B. 10 für 10%)"
            />
            <TextField
              label="Homepage"
              value={homepage}
              onChange={(e) => setHomepage(e.target.value)}
              fullWidth
            />
          </Stack>

          <Stack spacing={6.5}>
            <TextField
              inputRef={(el) => {
                dateInputRef.current = el;
              }}
              label="Datum"
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="text"
                      onClick={() => dateInputRef.current?.showPicker?.()}
                      sx={{ minWidth: 0, px: 1 }}
                      aria-label="Datum auswählen"
                    >
                      <CalendarMonthIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography sx={{ minWidth: 90, color: 'text.secondary', fontSize: 28 }}>
                Rating
              </Typography>
              <Rating value={rating ?? 0} onChange={(_, v) => setRating(v)} max={5} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography sx={{ minWidth: 140, color: 'text.secondary', fontSize: 28 }}>
                Lieferbar
              </Typography>
              <Checkbox checked={lieferbar} onChange={(e) => setLieferbar(e.target.checked)} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Typography sx={{ minWidth: 90, color: 'text.secondary', fontSize: 28 }}>
                Art
              </Typography>

              <FormControl sx={{ minWidth: 260 }}>
                <InputLabel id="art-label">Art</InputLabel>
                <Select
                  labelId="art-label"
                  label="Art"
                  value={art}
                  onChange={(e) => setArt(e.target.value as Buchart | '')}
                >
                  <MenuItem value="">(leer)</MenuItem>
                  {ART_OPTIONS.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !canSubmit}
          sx={{ width: 220, height: 44, fontWeight: 700 }}
        >
          {loading ? 'speichern…' : 'speichern'}
        </Button>
      </Box>
    </Box>
  );
}
