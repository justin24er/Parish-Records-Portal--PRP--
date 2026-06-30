// frontend/src/utils/helpers.js
// General utility functions

/**
 * Format a date to DD/MM/YYYY
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('sw-TZ', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
  });
}

/**
 * Format date-time to DD/MM/YYYY HH:mm
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return '—';
  return d.toLocaleString('sw-TZ', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get greeting based on current time (Swahili)
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Habari za Asubuhi';
  if (hour < 17) return 'Habari za Mchana';
  return 'Habari za Jioni';
}

/**
 * Generate user initials from a full name
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Build query string from an object
 */
export function buildQueryString(params = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

/**
 * Capitalize the first letter
 */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Safely parse JSON, return defaultValue on failure
 */
export function safeJSON(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * Sleep for ms milliseconds
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format a number with thousand separators
 */
export function formatNumber(n) {
  return (n ?? 0).toLocaleString('sw-TZ');
}

/**
 * Check if an object has no meaningful value
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string')  return value.trim() === '';
  if (Array.isArray(value))       return value.length === 0;
  if (typeof value === 'object')  return Object.keys(value).length === 0;
  return false;
}
