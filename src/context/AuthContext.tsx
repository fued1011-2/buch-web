'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type User = {
  username: string;
  roles: string[];
};

type AuthContextValue = {
  accessToken: string | null;
  user: User | null;
  authenticated: boolean;
  isAdmin: boolean;
  loginWithAccessToken: (accessToken: string, user?: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (storedToken) setAccessToken(storedToken);

    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) setUser(JSON.parse(storedUser) as User);
  }, []);

  const loginWithAccessToken = (newToken: string, newUser: User | null = null) => {
    setAccessToken(newToken);
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken);

    setUser(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo<AuthContextValue>(() => {
    const authenticated = !!accessToken;
    const roles = user?.roles ?? [];
    const isAdmin = roles.includes('admin');

    return {
      accessToken,
      user,
      authenticated,
      isAdmin,
      loginWithAccessToken,
      logout,
    };
  }, [accessToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
