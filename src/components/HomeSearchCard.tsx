'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

type SearchMode = 'title' | 'price' | 'isbn';

export function HomeSearchCard() {
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('title');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const q = query.trim();
    if (!q) return;

    const params = new URLSearchParams();
    params.set('q', q);
    params.set('mode', mode);

    router.push(`/books?${params.toString()}`);
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: 'min(620px, 92vw)',
        borderRadius: 2,
        p: 3,
        bgcolor: 'white',
      }}
    >
      <Typography variant="h6" align="center" sx={{ fontWeight: 800, mb: 2 }}>
        Starte hier Deine Suche
      </Typography>

      <Box component="form" onSubmit={handleSearch}>
        <Stack spacing={2}>
          <TextField
            placeholder="Suchen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            sx={{
              '& .MuiInputBase-root': {
                bgcolor: '#E9F1FA',
              },
            }}
          />

          <RadioGroup
            row
            value={mode}
            onChange={(e) => setMode(e.target.value as SearchMode)}
            sx={{ justifyContent: 'center', px: 1 }}
          >
            <FormControlLabel sx={{ pr: 8 }}value="title" control={<Radio />} label="nach Titel" />
            <FormControlLabel value="isbn" control={<Radio />} label="nach ISBN" />
          </RadioGroup>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ width: 220, fontWeight: 700, textTransform: 'none' }}
            >
              Suchen
            </Button>

            <Button
              variant="contained"
              onClick={() => router.push('/books')}
              sx={{ width: 220, fontWeight: 700, textTransform: 'none' }}
            >
              erweiterte Suche
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
