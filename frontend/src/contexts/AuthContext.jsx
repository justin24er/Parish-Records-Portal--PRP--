// frontend/src/contexts/AuthContext.jsx

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
        const u   = res.data.user;
        setUser(u);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      } catch (err) {
        // Only clear the stored user if it's genuinely a 401 (invalid session).
        // Network errors / server down should NOT log the user out.
        const status = err?.status ?? err?.response?.status;
        if (status === 401) {
          setUser(null);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
        // For any other error keep whatever was in localStorage so the
        // user is not unexpectedly bounced to the login page.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const res    = await authService.login(credentials);
    const u      = res.data.user;
    setUser(u);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
    return u;
  }, []);

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }, []);

  // ── Update user (profile edits, etc.) ────────────────────
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
