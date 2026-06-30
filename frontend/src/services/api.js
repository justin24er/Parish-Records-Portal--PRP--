// Axios instance configured for PRP backend

import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send HTTP-only cookies
});

// ── Request interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Token is stored in HTTP-only cookie, so nothing to attach manually.
    // If you need a bearer token from localStorage (fallback), uncomment:
    // const token = localStorage.getItem('prp_token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || 'Kuna hitilafu. Jaribu tena.';

    if (status === 401) {
      // Session expired — clear storage and redirect to login
      localStorage.removeItem('prp_user');
      if (window.location.pathname !== '/ingia') {
        window.location.href = '/ingia';
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
export const authService = {
  login:          (data) => api.post('/auth/login', data),
  logout:         ()     => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (data) => api.post('/auth/reset-password', data),
  getMe:          ()     => api.get('/auth/me'),
};

// ── Dashboard service ─────────────────────────────────────────
export const dashboardService = {
  getStats:      ()   => api.get('/dashboard/stats'),
  getActivities: ()   => api.get('/dashboard/activities'),
};