// src/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter, forgotPasswordLimiter } = require('../middleware/rateLimit');
const { validate } = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  asyncHandler(ctrl.login)
);

router.post('/refresh', asyncHandler(ctrl.refresh));
router.post('/logout', asyncHandler(ctrl.logout));
router.get('/me', authenticate, asyncHandler(ctrl.me));

router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  [body('email').isEmail()],
  validate,
  asyncHandler(ctrl.forgotPassword)
);

router.post(
  '/reset-password',
  [body('uid').notEmpty(), body('token').notEmpty(), body('newPassword').isLength({ min: 8 })],
  validate,
  asyncHandler(ctrl.resetPassword)
);

module.exports = router;
