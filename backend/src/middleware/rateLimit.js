// src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

// Generic API limiter — protects the whole API from brute-force/DoS bursts.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Maombi mengi sana. Jaribu tena baadaye.' },
});

// Strict limiter for login — slows down credential-stuffing / brute force.
const loginLimiter = rateLimit({
  windowMs: env.LOGIN_RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Majaribio mengi ya kuingia. Subiri kabla ya kujaribu tena.' },
  skipSuccessfulRequests: true,
});

// Strict limiter for forgot-password — prevents email-bombing a user and
// prevents attackers from mass-probing which emails exist in the system.
const forgotPasswordLimiter = rateLimit({
  windowMs: env.FORGOT_PW_RATE_LIMIT_WINDOW_MIN * 60 * 1000,
  max: env.FORGOT_PW_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Maombi mengi ya kubadili nywila. Jaribu tena baadaye.' },
});

module.exports = { apiLimiter, loginLimiter, forgotPasswordLimiter };
