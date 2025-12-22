'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

import { login } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithAccessToken } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Bitte Benutzername und Passwort eingeben.');
      return;
    }

    setLoading(true);
    try {
      const tokenData = await login(username, password);
      loginWithAccessToken(tokenData.access_token);
      router.replace('/books');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Paper
        elevation={6}
        sx={{
          width: 'min(900px, 92vw)',
          borderRadius: 2,
          bgcolor: '#E9F1FA',
          px: { xs: 3, sm: 8 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Stack spacing={5} alignItems="center">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 420 }}>
            <Stack spacing={3} alignItems="center">
              {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Benutzername"
                required
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                label="Passwort"
                required
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ width: 320, height: 44, fontWeight: 600 }}
              >
                {loading ? 'ANMELDEN…' : 'ANMELDEN'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
