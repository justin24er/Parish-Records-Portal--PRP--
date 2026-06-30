// Provides authentication state and actions throughout the app.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';
import { STORAGE_KEYS } from '../constants/app';
import { safeJSON } from '../utils/helpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => safeJSON(localStorage.getItem(STORAGE_KEYS.USER)));
  const [loading, setLoading] = useState(true);

  // ── Verify session on mount ───────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await authService.getMe();
        setUser(res.data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(res.data.user));
      } catch {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    const { user: u } = res.data;
    setUser(u);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
    return u;
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore errors — proceed with local cleanup
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, []);

  // ── Update user (e.g. after profile edit) ────────────────
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;