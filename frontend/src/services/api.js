// frontend/src/services/api.js
// ─────────────────────────────────────────────────────────────
// Set MOCK_MODE = true  → runs entirely in the browser (no backend needed).
// Set MOCK_MODE = false → hits the real Express/Node backend at VITE_API_URL.
// ─────────────────────────────────────────────────────────────

import axios from 'axios';
import toast  from 'react-hot-toast';
import { mockAuthService, mockDashboardService } from './mockAuth';

export const MOCK_MODE = false; // ← the real backend is connected

// ── Real axios instance (used when MOCK_MODE = false) ────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // sends the httpOnly refresh-token cookie automatically
});

// ── In-memory access token ─────────────────────────────────────
// The short-lived JWT access token lives in memory (not localStorage) so it
// can't be lifted by an XSS payload reading storage. The long-lived refresh
// token is an httpOnly cookie the browser JS can never read at all — the
// server sets/clears it. This pairing is standard practice for SPA auth.
let accessToken = null;
export function setAccessToken(token) { accessToken = token; }
export function getAccessToken() { return accessToken; }

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshingPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status    = error.response?.status;
    const message   = error.response?.data?.message || 'Kuna hitilafu. Jaribu tena.';

    // One silent refresh attempt on 401, then retry the original request.
    if (status === 401 && !original?._retried && !original?.url?.includes('/auth/')) {
      original._retried = true;
      try {
        if (!refreshingPromise) {
          refreshingPromise = api.post('/auth/refresh').finally(() => { refreshingPromise = null; });
        }
        const res = await refreshingPromise;
        setAccessToken(res.data.accessToken);
        return api(original);
      } catch {
        setAccessToken(null);
        localStorage.removeItem('prp_user');
        if (window.location.pathname !== '/ingia') window.location.href = '/ingia';
      }
    } else if (status === 403) {
      toast.error('Huna ruhusa ya kufanya hivi.');
    } else if (status === 500) {
      toast.error('Hitilafu ya seva. Jaribu tena baadaye.');
    } else if (!error.response) {
      toast.error('Hakuna muunganiko wa mtandao.');
    }

    return Promise.reject({ status, message, raw: error });
  },
);

export default api;

// ── Auth service ─────────────────────────────────────────────
export const authService = MOCK_MODE
  ? mockAuthService
  : {
      login: async (data) => {
        const res = await api.post('/auth/login', data);
        setAccessToken(res.data.accessToken);
        return res;
      },
      logout: async () => {
        const res = await api.post('/auth/logout');
        setAccessToken(null);
        return res;
      },
      forgotPassword: (data) => api.post('/auth/forgot-password', data),
      resetPassword:  (data) => api.post('/auth/reset-password', data),
      getMe: async () => {
        // On a fresh page load there is no in-memory access token yet, so
        // silently refresh first using the httpOnly cookie before asking /me.
        if (!accessToken) {
          try {
            const r = await api.post('/auth/refresh');
            setAccessToken(r.data.accessToken);
          } catch {
            // no valid session — getMe below will correctly 401
          }
        }
        return api.get('/auth/me');
      },
    };

// ── Dashboard service ─────────────────────────────────────────
export const dashboardService = MOCK_MODE
  ? mockDashboardService
  : {
      getStats:      () => api.get('/dashboard/stats'),
      getActivities: () => api.get('/dashboard/activities'),
    };

// ── User management service (Super Admin / Katibu-Padre control panel) ──
export const userService = {
  list:        (params)     => api.get('/users', { params }),
  create:      (data)       => api.post('/users', data),
  update:      (id, data)   => api.patch(`/users/${id}`, data),
  remove:      (id)         => api.delete(`/users/${id}`),
  forceReset:  (id)         => api.post(`/users/${id}/force-reset`),
};

// ── Document / camera-capture service ─────────────────────────
export const documentService = {
  list:    (params) => api.get('/documents', { params }),
  upload:  (formData, onUploadProgress) =>
    api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  fileUrl: (id) => `${BASE_URL}/documents/${id}/file`,
  remove:  (id) => api.delete(`/documents/${id}`),
};

// ── Vitabu vya Kanisa (church registry books) service ──────────
export const vitabuService = {
  list:   ()     => api.get('/vitabu'),
  create: (data) => api.post('/vitabu', data),
};

// ── Audit log service (Super Admin only) ────────────────────────
export const auditService = {
  list: (params) => api.get('/audit-logs', { params }),
};
