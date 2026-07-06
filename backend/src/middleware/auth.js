// src/middleware/auth.js
const { verifyAccessToken } = require('../utils/tokens');
const db = require('../config/db');

// Role hierarchy: super_admin > admin (Katibu/Padre) > secretary > viewer
const ROLE_RANK = { viewer: 1, secretary: 2, admin: 3, super_admin: 4 };

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.prp_access;

  if (!token) {
    return res.status(401).json({ message: 'Hujaingia. Tafadhali ingia tena.' });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.sub);
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Akaunti haipo au imezuiwa.' });
    }
    delete user.password_hash;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Kikao kimeisha. Tafadhali ingia tena.' });
  }
}

// requireRole('admin') → admin AND super_admin pass. Roles are hierarchical.
function requireRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Hujaingia.' });
    const userRank = ROLE_RANK[req.user.role] || 0;
    const requiredRank = ROLE_RANK[minRole] || 999;
    if (userRank < requiredRank) {
      return res.status(403).json({ message: 'Huna ruhusa ya kufanya hivi.' });
    }
    next();
  };
}

// Only the super admin (you) may act — used for the most sensitive endpoints
// like promoting/demoting admins or deleting a parish admin account.
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Ni Msimamizi Mkuu tu anayeweza kufanya hivi.' });
  }
  next();
}

module.exports = { authenticate, requireRole, requireSuperAdmin, ROLE_RANK };
