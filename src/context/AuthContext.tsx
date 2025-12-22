'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { clearAccessToken, getAccessToken, setAccessToken } from '../lib/auth';

type AuthContextValue = {
  authenticated: boolean;
  loginWithAccessToken: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getAccessToken());

  const loginWithAccessToken = (newToken: string) => {
    setAccessToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    clearAccessToken();
    setTokenState(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      authenticated: Boolean(token),
      loginWithAccessToken,
      logout,
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
