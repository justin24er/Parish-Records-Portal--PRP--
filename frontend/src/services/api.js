// frontend/src/services/api.js
// ─────────────────────────────────────────────────────────────
// Set MOCK_MODE = true  → runs entirely in the browser (no backend needed).
// Set MOCK_MODE = false → hits the real Next.js API at VITE_API_URL.
// ─────────────────────────────────────────────────────────────

import axios from 'axios';
import toast  from 'react-hot-toast';
import { mockAuthService, mockDashboardService } from './mockAuth';

export const MOCK_MODE = true; // ← flip to false when backend is ready

// ── Real axios instance (used when MOCK_MODE = false) ────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || 'Kuna hitilafu. Jaribu tena.';

    if (status === 401) {
      localStorage.removeItem('prp_user');
      if (window.location.pathname !== '/ingia') window.location.href = '/ingia';
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
      login:          (data) => api.post('/auth/login', data),
      logout:         ()     => api.post('/auth/logout'),
      forgotPassword: (data) => api.post('/auth/forgot-password', data),
      resetPassword:  (data) => api.post('/auth/reset-password', data),
      getMe:          ()     => api.get('/auth/me'),
    };

// ── Dashboard service ─────────────────────────────────────────
export const dashboardService = MOCK_MODE
  ? mockDashboardService
  : {
      getStats:      () => api.get('/dashboard/stats'),
      getActivities: () => api.get('/dashboard/activities'),
    };
