'use client';

import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
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

type FieldName = 'titel' | 'isbn' | 'preis' | 'rabatt' | 'homepage' | 'datum' | 'rating';
type FieldErrors = Partial<Record<FieldName, string>>;
type Touched = Partial<Record<FieldName, boolean>>;

type Props = {
  isAdmin: boolean;

  titel: string;
  setTitel: Dispatch<SetStateAction<string>>;

  isbn: string;
  setIsbn: Dispatch<SetStateAction<string>>;

  preis: string;
  setPreis: Dispatch<SetStateAction<string>>;

  rabatt: string;
  setRabatt: Dispatch<SetStateAction<string>>;

  homepage: string;
  setHomepage: Dispatch<SetStateAction<string>>;

  datum: string;
  setDatum: Dispatch<SetStateAction<string>>;

  rating: number | null;
  setRating: Dispatch<SetStateAction<number | null>>;

  lieferbar: boolean;
  setLieferbar: Dispatch<SetStateAction<boolean>>;

  art: Buchart | '';
  setArt: Dispatch<SetStateAction<Buchart | ''>>;

  artOptions: Buchart[];

  loading: boolean;
  canSubmit: boolean;

  error: string | null;
  onSubmit: (e: React.FormEvent) => void;

  dateInputRef: MutableRefObject<HTMLInputElement | null>;

  touched: Touched;
  markTouched: (name: FieldName) => void;
  fieldErrors: FieldErrors;
};

export function BookCreateCard({
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
  artOptions,
  loading,
  canSubmit,
  error,
  onSubmit,
  dateInputRef,
  touched,
  markTouched,
  fieldErrors,
}: Props) {
  const helper = (name: FieldName) => (touched[name] ? fieldErrors[name] : undefined);
  const hasError = (name: FieldName) => Boolean(touched[name] && fieldErrors[name]);

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
            Du bist nicht als Admin eingeloggt. Das Anlegen wird vom Backend per `403 Forbidden` abgelehnt.
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
          <Stack spacing={4}>
            <TextField
              label="Titel *"
              value={titel}
              onChange={(e) => setTitel(e.target.value)}
              onBlur={() => markTouched('titel')}
              required
              fullWidth
              error={hasError('titel')}
              helperText={helper('titel')}
            />

            <TextField
              label="ISBN *"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              onBlur={() => markTouched('isbn')}
              required
              fullWidth
              error={hasError('isbn')}
              helperText={helper('isbn')}
            />

            <TextField
              label="Preis *"
              value={preis}
              onChange={(e) => setPreis(e.target.value)}
              onBlur={() => markTouched('preis')}
              required
              fullWidth
              inputMode="decimal"
              error={hasError('preis')}
              helperText={helper('preis')}
            />

            <TextField
              label="Rabatt"
              value={rabatt}
              onChange={(e) => setRabatt(e.target.value)}
              onBlur={() => markTouched('rabatt')}
              fullWidth
              inputMode="decimal"
              error={hasError('rabatt')}
              helperText={helper('rabatt') ?? 'in Prozent (z.B. 10 für 10%)'}
            />

            <TextField
              label="Homepage"
              value={homepage}
              onChange={(e) => setHomepage(e.target.value)}
              onBlur={() => markTouched('homepage')}
              fullWidth
              error={hasError('homepage')}
              helperText={helper('homepage')}
            />
          </Stack>

          <Stack spacing={4}>
            <TextField
              inputRef={(el) => {
                dateInputRef.current = el;
              }}
              label="Datum"
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              onBlur={() => markTouched('datum')}
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={hasError('datum')}
              helperText={helper('datum')}
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
            {helper('rating') ? (
              <Typography sx={{ mt: -2, color: 'error.main', fontSize: 12 }}>
                {helper('rating')}
              </Typography>
            ) : null}

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
                  {artOptions.map((a) => (
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
