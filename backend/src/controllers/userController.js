// src/controllers/userController.js
// Powers the "Msimamizi Mkuu" (Super Admin) control panel: add/remove users,
// promote/demote Katibu/Padre admins, force password resets, activate/deactivate.
//
// Access rules:
//  - super_admin: full control over every user in every parish, including
//    creating/removing other admins ("Katibu"/"Padre") and other super admins.
//  - admin (Katibu/Padre): can manage secretary/viewer accounts within their
//    OWN parish only. Cannot create or touch admin/super_admin accounts.

const crypto = require('crypto');
const userModel = require('../models/userModel');
const { sendMail, newUserEmail } = require('../utils/email');
const { logAction } = require('../utils/audit');
const env = require('../config/env');

function generateTempPassword() {
  // 12 random chars from a readable charset — sent once via email, and the
  // account is flagged must_change_password so it cannot be relied upon long-term.
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  return Array.from(crypto.randomFillSync(new Uint8Array(12)))
    .map((b) => chars[b % chars.length])
    .join('');
}

function canActOn(actor, targetRole) {
  if (actor.role === 'super_admin') return true;
  if (actor.role === 'admin') return ['secretary', 'viewer'].includes(targetRole);
  return false;
}

// ── GET /api/users ──────────────────────────────────────────────
async function listUsers(req, res) {
  const parishScope = req.user.role === 'super_admin' ? req.query.parishId || null : req.user.parish_id;
  const users = userModel.listUsers({ parishId: parishScope, role: req.query.role || null });
  res.json({ users });
}

// ── POST /api/users ──────────────────────────────────────────────
async function createUser(req, res) {
  const { fullName, email, role = 'viewer', title, parishId } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: 'Jina na barua pepe vinahitajika.' });
  }
  if (!['admin', 'secretary', 'viewer', 'super_admin'].includes(role)) {
    return res.status(400).json({ message: 'Aina ya mtumiaji si sahihi.' });
  }
  if (role === 'super_admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Huwezi kuunda Msimamizi Mkuu mwingine.' });
  }
  if (!canActOn(req.user, role)) {
    return res.status(403).json({ message: 'Huna ruhusa ya kuunda mtumiaji wa aina hii.' });
  }
  if (userModel.findByEmail(email)) {
    return res.status(409).json({ message: 'Barua pepe hii tayari imesajiliwa.' });
  }

  const effectiveParishId = req.user.role === 'super_admin' ? (parishId || null) : req.user.parish_id;
  const tempPassword = generateTempPassword();

  const user = userModel.createUser({
    fullName,
    email,
    password: tempPassword,
    role,
    title: title || (role === 'admin' ? 'Katibu' : null),
    parishId: effectiveParishId,
    createdBy: req.user.id,
    mustChangePassword: 1,
  });

  const { subject, html, text } = newUserEmail({
    name: fullName,
    email,
    tempPassword,
    loginUrl: `${env.CLIENT_URL}/ingia`,
    title: user.title,
  });
  await sendMail({ to: email, subject, html, text });

  logAction({
    actorUserId: req.user.id,
    actorEmail: req.user.email,
    action: 'user.create',
    targetType: 'user',
    targetId: user.id,
    metadata: { role, email },
    req,
  });

  res.status(201).json({ user: userModel.safeUser(user) });
}

// ── PATCH /api/users/:id ─────────────────────────────────────────
async function updateUser(req, res) {
  const target = userModel.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'Mtumiaji hapatikani.' });

  if (!canActOn(req.user, target.role)) {
    return res.status(403).json({ message: 'Huna ruhusa ya kubadilisha mtumiaji huyu.' });
  }
  if (req.user.role === 'admin' && target.parish_id !== req.user.parish_id) {
    return res.status(403).json({ message: 'Unaweza kusimamia watumiaji wa parokia yako pekee.' });
  }

  const { fullName, role, title, isActive } = req.body;

  // Only super_admin may promote someone INTO admin/super_admin.
  if (role && role !== target.role) {
    if (['admin', 'super_admin'].includes(role) && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Ni Msimamizi Mkuu tu anayeweza kupandisha cheo hadi Msimamizi/Katibu.' });
    }
  }

  const updated = userModel.updateUser(target.id, {
    full_name: fullName,
    role,
    title,
    is_active: isActive === undefined ? undefined : (isActive ? 1 : 0),
  });

  logAction({
    actorUserId: req.user.id,
    actorEmail: req.user.email,
    action: 'user.update',
    targetType: 'user',
    targetId: target.id,
    metadata: req.body,
    req,
  });

  res.json({ user: userModel.safeUser(updated) });
}

// ── DELETE /api/users/:id ─────────────────────────────────────────
async function deleteUser(req, res) {
  const target = userModel.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'Mtumiaji hapatikani.' });

  if (target.id === req.user.id) {
    return res.status(400).json({ message: 'Huwezi kujifuta mwenyewe.' });
  }
  if (target.role === 'super_admin') {
    return res.status(403).json({ message: 'Akaunti ya Msimamizi Mkuu haiwezi kufutwa hapa. Wasiliana na Anthropic/mtoa huduma wa mfumo kama hii ni dharura.' });
  }
  if (!canActOn(req.user, target.role)) {
    return res.status(403).json({ message: 'Huna ruhusa ya kufuta mtumiaji huyu.' });
  }

  userModel.deleteUser(target.id);
  logAction({
    actorUserId: req.user.id,
    actorEmail: req.user.email,
    action: 'user.delete',
    targetType: 'user',
    targetId: target.id,
    metadata: { email: target.email, role: target.role },
    req,
  });

  res.json({ ok: true });
}

// ── POST /api/users/:id/force-reset ──────────────────────────────
// Super admin / admin-triggered password reset (as opposed to the user's own
// self-service "forgot password" flow). Generates a fresh temporary password,
// emails it to the user's REGISTERED address only, and forces a change on
// next login.
async function forceResetPassword(req, res) {
  const target = userModel.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'Mtumiaji hapatikani.' });
  if (!canActOn(req.user, target.role)) {
    return res.status(403).json({ message: 'Huna ruhusa kwa mtumiaji huyu.' });
  }

  const tempPassword = generateTempPassword();
  userModel.setPassword(target.id, tempPassword, { mustChangePassword: 1 });

  const { subject, html, text } = newUserEmail({
    name: target.full_name,
    email: target.email,
    tempPassword,
    loginUrl: `${env.CLIENT_URL}/ingia`,
    title: target.title,
  });
  await sendMail({ to: target.email, subject, html, text });

  logAction({
    actorUserId: req.user.id,
    actorEmail: req.user.email,
    action: 'user.force_reset_password',
    targetType: 'user',
    targetId: target.id,
    req,
  });

  res.json({ message: 'Nywila mpya ya muda imetumwa kwenye barua pepe ya mtumiaji.' });
}

module.exports = { listUsers, createUser, updateUser, deleteUser, forceResetPassword };
