// src/config/env.js
// Loads and validates environment variables in one place so the
// rest of the app never touches process.env directly.

require('dotenv').config();

function required(name, fallback = undefined) {
  const val = process.env[name] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  APP_URL: process.env.APP_URL || 'http://localhost:4000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  DB_PATH: process.env.DB_PATH || './data/prp.db',

  JWT_ACCESS_SECRET: required('JWT_ACCESS_SECRET', 'dev-only-insecure-access-secret-change-me'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET', 'dev-only-insecure-refresh-secret-change-me'),
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',

  RESET_TOKEN_EXPIRES_MIN: parseInt(process.env.RESET_TOKEN_EXPIRES_MIN || '30', 10),

  COOKIE_SECURE: (process.env.COOKIE_SECURE || 'false') === 'true',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || undefined,

  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_SECURE: (process.env.SMTP_SECURE || 'false') === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'Parish Records Portal',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'no-reply@example.com',

  LOGIN_RATE_LIMIT_MAX: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '8', 10),
  LOGIN_RATE_LIMIT_WINDOW_MIN: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MIN || '15', 10),
  FORGOT_PW_RATE_LIMIT_MAX: parseInt(process.env.FORGOT_PW_RATE_LIMIT_MAX || '5', 10),
  FORGOT_PW_RATE_LIMIT_WINDOW_MIN: parseInt(process.env.FORGOT_PW_RATE_LIMIT_WINDOW_MIN || '60', 10),

  MAX_FAILED_LOGIN_ATTEMPTS: parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5', 10),
  LOCKOUT_DURATION_MIN: parseInt(process.env.LOCKOUT_DURATION_MIN || '30', 10),

  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB || '8', 10),
};

module.exports = env;
