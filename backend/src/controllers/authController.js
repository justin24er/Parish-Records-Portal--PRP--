// src/controllers/authController.js
const crypto = require('crypto');
const db = require('../config/db');
const env = require('../config/env');
const userModel = require('../models/userModel');
const { signAccessToken, signRefreshToken, verifyRefreshToken, generateOpaqueToken, hashToken } = require('../utils/tokens');
const { sendMail, passwordResetEmail, passwordChangedEmail } = require('../utils/email');
const { logAction } = require('../utils/audit');

const REFRESH_COOKIE = 'prp_refresh';

function cookieOpts(maxAgeMs) {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? 'strict' : 'lax',
    domain: env.COOKIE_DOMAIN,
    maxAge: maxAgeMs,
    path: '/api/auth',
  };
}

function issueTokens(res, user, req) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  db.prepare(`
    INSERT INTO refresh_tokens (id, user_id, token_hash, user_agent, ip_address, expires_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', '+7 days'))
  `).run(crypto.randomUUID(), user.id, hashToken(refreshToken), req.headers['user-agent'] || null, req.ip);

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));
  return accessToken;
}

// ── POST /api/auth/login ──────────────────────────────────────
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Barua pepe na nywila zinahitajika.' });
  }

  const user = userModel.findByEmail(email);

  // Constant-shape response whether or not the user exists, to avoid
  // leaking which emails are registered via timing/response differences.
  if (!user) {
    logAction({ actorEmail: email, action: 'auth.login.failed', metadata: { reason: 'no_such_user' }, req });
    return res.status(401).json({ message: 'Barua pepe au nywila si sahihi.' });
  }

  if (!user.is_active) {
    logAction({ actorUserId: user.id, actorEmail: email, action: 'auth.login.failed', metadata: { reason: 'inactive' }, req });
    return res.status(403).json({ message: 'Akaunti hii imezimwa. Wasiliana na msimamizi.' });
  }

  if (userModel.isLocked(user)) {
    logAction({ actorUserId: user.id, actorEmail: email, action: 'auth.login.failed', metadata: { reason: 'locked' }, req });
    return res.status(423).json({ message: 'Akaunti imefungwa kwa muda kutokana na majaribio mengi. Jaribu tena baadaye.' });
  }

  const valid = userModel.comparePassword(password, user.password_hash);
  if (!valid) {
    const { attempts, lockedUntil } = userModel.recordFailedLogin(user.id, {
      maxAttempts: env.MAX_FAILED_LOGIN_ATTEMPTS,
      lockoutMin: env.LOCKOUT_DURATION_MIN,
    });
    logAction({ actorUserId: user.id, actorEmail: email, action: 'auth.login.failed', metadata: { attempts, lockedUntil }, req });
    return res.status(401).json({ message: 'Barua pepe au nywila si sahihi.' });
  }

  userModel.recordSuccessfulLogin(user.id, req.ip);
  const accessToken = issueTokens(res, user, req);
  logAction({ actorUserId: user.id, actorEmail: user.email, action: 'auth.login.success', req });

  res.json({
    accessToken,
    user: userModel.safeUser(userModel.findById(user.id)),
  });
}

// ── POST /api/auth/refresh ────────────────────────────────────
async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) return res.status(401).json({ message: 'Hakuna kikao. Tafadhali ingia tena.' });

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ message: 'Kikao kimeisha. Tafadhali ingia tena.' });
  }

  const row = db
    .prepare('SELECT * FROM refresh_tokens WHERE user_id = ? AND token_hash = ? AND revoked_at IS NULL')
    .get(payload.sub, hashToken(token));

  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(401).json({ message: 'Kikao kimeisha. Tafadhali ingia tena.' });
  }

  const user = userModel.findById(payload.sub);
  if (!user || !user.is_active) return res.status(401).json({ message: 'Akaunti haipo au imezuiwa.' });

  // Rotate: revoke old refresh token, issue a new pair.
  db.prepare("UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE id = ?").run(row.id);
  const accessToken = issueTokens(res, user, req);

  res.json({ accessToken, user: userModel.safeUser(user) });
}

// ── POST /api/auth/logout ─────────────────────────────────────
async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    db.prepare("UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE token_hash = ?").run(hashToken(token));
  }
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
  if (req.user) logAction({ actorUserId: req.user.id, actorEmail: req.user.email, action: 'auth.logout', req });
  res.json({ ok: true });
}

// ── GET /api/auth/me ───────────────────────────────────────────
async function me(req, res) {
  res.json({ user: userModel.safeUser(req.user) });
}

// ── POST /api/auth/forgot-password ─────────────────────────────
// SECURITY NOTE: always responds with the same generic message whether or
// not the email exists, so an attacker cannot use this endpoint to discover
// which email addresses are registered ("user enumeration"). The email is
// only actually sent when a matching, active account is found — i.e. reset
// links only ever go to the real registered inbox of that user.
async function forgotPassword(req, res) {
  const { email } = req.body;
  const generic = { message: 'Kama barua pepe hiyo ipo kwenye mfumo, kiungo cha kuweka upya nywila kimetumwa.' };

  if (!email) return res.status(400).json({ message: 'Barua pepe inahitajika.' });

  const user = userModel.findByEmail(email);
  if (!user || !user.is_active) {
    logAction({ actorEmail: email, action: 'auth.forgot_password.unknown_email', req });
    return res.json(generic); // do not reveal non-existence
  }

  const { raw, hash } = generateOpaqueToken();
  db.prepare(`
    INSERT INTO password_resets (id, user_id, token_hash, expires_at, requested_ip)
    VALUES (?, ?, ?, datetime('now', '+' || ? || ' minutes'), ?)
  `).run(crypto.randomUUID(), user.id, hash, env.RESET_TOKEN_EXPIRES_MIN, req.ip);

  const resetUrl = `${env.CLIENT_URL}/weka-nywila-mpya?token=${raw}&uid=${user.id}`;
  const { subject, html, text } = passwordResetEmail({
    name: user.full_name,
    resetUrl,
    expiresMin: env.RESET_TOKEN_EXPIRES_MIN,
  });

  await sendMail({ to: user.email, subject, html, text });
  logAction({ actorUserId: user.id, actorEmail: user.email, action: 'auth.forgot_password.requested', req });

  res.json(generic);
}

// ── POST /api/auth/reset-password ───────────────────────────────
async function resetPassword(req, res) {
  const { uid, token, newPassword } = req.body;
  if (!uid || !token || !newPassword) {
    return res.status(400).json({ message: 'Taarifa hazitoshi.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Nywila mpya lazima iwe herufi/tarakimu 8 au zaidi.' });
  }

  const tokenHash = hashToken(token);
  const row = db
    .prepare(`
      SELECT * FROM password_resets
      WHERE user_id = ? AND token_hash = ? AND used_at IS NULL
      ORDER BY created_at DESC LIMIT 1
    `)
    .get(uid, tokenHash);

  if (!row || new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ message: 'Kiungo cha kuweka upya nywila si sahihi au kimeisha muda.' });
  }

  const user = userModel.findById(uid);
  if (!user) return res.status(400).json({ message: 'Mtumiaji hapatikani.' });

  userModel.setPassword(user.id, newPassword, { mustChangePassword: 0 });
  db.prepare("UPDATE password_resets SET used_at = datetime('now') WHERE id = ?").run(row.id);
  // Invalidate all existing sessions for this user as a precaution.
  db.prepare("UPDATE refresh_tokens SET revoked_at = datetime('now') WHERE user_id = ? AND revoked_at IS NULL").run(user.id);

  const { subject, html, text } = passwordChangedEmail({ name: user.full_name });
  await sendMail({ to: user.email, subject, html, text });
  logAction({ actorUserId: user.id, actorEmail: user.email, action: 'auth.reset_password.success', req });

  res.json({ message: 'Nywila imebadilishwa. Sasa unaweza kuingia.' });
}

module.exports = { login, refresh, logout, me, forgotPassword, resetPassword };
