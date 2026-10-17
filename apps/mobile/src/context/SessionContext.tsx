import React, { createContext, useContext, useEffect, useState } from 'react';
import * as TokenStorage from '../storage/tokenStorage';
import { apiClient } from '../api/client';
import { IdentityResponse } from '../types/api';

export type AuthState = 'BOOTSTRAPPING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface SessionContextType {
  state: AuthState;
  accessToken: string | null;
  identity: IdentityResponse | null;
  register: (email: string, password: string, name?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const TOKEN_KEY = 'shadow_access_token';

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>('BOOTSTRAPPING');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Bootstrap session on app start
  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      setState('BOOTSTRAPPING');
      const storedToken = await TokenStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setState('UNAUTHENTICATED');
        setAccessToken(null);
        setIdentity(null);
        return;
      }

      // Token exists, try to fetch current identity
      apiClient.setToken(storedToken);
      const identityData = await apiClient.getMe();

      setAccessToken(storedToken);
      setIdentity(identityData);
      setState('AUTHENTICATED');
    } catch (err) {
      // Token is invalid or expired, clear session
      await TokenStorage.deleteItem(TOKEN_KEY);
      apiClient.setToken(null);
      setAccessToken(null);
      setIdentity(null);
      setState('UNAUTHENTICATED');
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
  ) => {
    try {
      setError(null);
      const response = await apiClient.register({
        email,
        password,
        name,
      });

      const token = response.access_token;
      apiClient.setToken(token);
      await TokenStorage.setItem(TOKEN_KEY, token);

      // After registering, fetch full identity
      const identityData = await apiClient.getMe();
      setIdentity(identityData);
      setAccessToken(token);
      setState('AUTHENTICATED');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await apiClient.login({
        email,
        password,
      });

      const token = response.access_token;
      apiClient.setToken(token);
      await TokenStorage.setItem(TOKEN_KEY, token);

      // After logging in, fetch full identity
      const identityData = await apiClient.getMe();
      setIdentity(identityData);
      setAccessToken(token);
      setState('AUTHENTICATED');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await TokenStorage.deleteItem(TOKEN_KEY);
      apiClient.setToken(null);
      setAccessToken(null);
      setIdentity(null);
      setState('UNAUTHENTICATED');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Logout failed';
      setError(message);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: SessionContextType = {
    state,
    accessToken,
    identity,
    register,
    login,
    logout,
    bootstrap,
    error,
    clearError,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
