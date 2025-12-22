'use client';

import type { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Falls du @mui/material-nextjs NICHT installiert hast: diese zwei Zeilen löschen
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { AuthProvider } from '../context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#044878',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
      },
    },
  },
});
export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
