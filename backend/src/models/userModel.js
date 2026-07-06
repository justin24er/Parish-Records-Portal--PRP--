// src/models/userModel.js
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

const SALT_ROUNDS = 12;

function hashPassword(plain) {
  return bcrypt.hashSync(plain, SALT_ROUNDS);
}

function comparePassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);
}

function findById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function listUsers({ parishId = null, role = null } = {}) {
  let q = 'SELECT id, parish_id, full_name, email, role, title, is_active, must_change_password, last_login_at, created_at FROM users WHERE 1=1';
  const params = {};
  if (parishId) {
    q += ' AND parish_id = @parishId';
    params.parishId = parishId;
  }
  if (role) {
    q += ' AND role = @role';
    params.role = role;
  }
  q += ' ORDER BY created_at DESC';
  return db.prepare(q).all(params);
}

function createUser({ fullName, email, password, role = 'viewer', title = null, parishId = null, createdBy = null, mustChangePassword = 0 }) {
  const id = uuidv4();
  db.prepare(`
    INSERT INTO users (id, parish_id, full_name, email, password_hash, role, title, created_by, must_change_password)
    VALUES (@id, @parishId, @fullName, @email, @passwordHash, @role, @title, @createdBy, @mustChangePassword)
  `).run({
    id,
    parishId,
    fullName,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    role,
    title,
    createdBy,
    mustChangePassword,
  });
  return findById(id);
}

function updateUser(id, fields) {
  const allowed = ['full_name', 'email', 'role', 'title', 'is_active', 'parish_id'];
  const sets = [];
  const params = { id };
  for (const key of allowed) {
    if (fields[key] !== undefined) {
      sets.push(`${key} = @${key}`);
      params[key] = fields[key];
    }
  }
  if (!sets.length) return findById(id);
  sets.push("updated_at = datetime('now')");
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = @id`).run(params);
  return findById(id);
}

function setPassword(id, newPassword, { mustChangePassword = 0 } = {}) {
  db.prepare(`
    UPDATE users SET password_hash = ?, must_change_password = ?, updated_at = datetime('now'),
      failed_login_attempts = 0, locked_until = NULL
    WHERE id = ?
  `).run(hashPassword(newPassword), mustChangePassword, id);
}

function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

function recordFailedLogin(id, { maxAttempts, lockoutMin }) {
  const user = findById(id);
  const attempts = (user.failed_login_attempts || 0) + 1;
  let lockedUntil = null;
  if (attempts >= maxAttempts) {
    lockedUntil = new Date(Date.now() + lockoutMin * 60 * 1000).toISOString();
  }
  db.prepare('UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?').run(
    attempts,
    lockedUntil,
    id
  );
  return { attempts, lockedUntil };
}

function recordSuccessfulLogin(id, ip) {
  db.prepare(`
    UPDATE users SET failed_login_attempts = 0, locked_until = NULL,
      last_login_at = datetime('now'), last_login_ip = ?
    WHERE id = ?
  `).run(ip, id);
}

function isLocked(user) {
  if (!user.locked_until) return false;
  return new Date(user.locked_until).getTime() > Date.now();
}

function safeUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

module.exports = {
  hashPassword,
  comparePassword,
  findByEmail,
  findById,
  listUsers,
  createUser,
  updateUser,
  setPassword,
  deleteUser,
  recordFailedLogin,
  recordSuccessfulLogin,
  isLocked,
  safeUser,
};
