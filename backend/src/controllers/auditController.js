// src/controllers/auditController.js
// Read-only security/audit log viewer — super_admin only. Lets you see
// every login, user-management action, and document access in the system.

const { listAuditLogs } = require('../utils/audit');

async function getAuditLogs(req, res) {
  const { limit = 100, offset = 0, action, actorUserId } = req.query;
  const logs = listAuditLogs({
    limit: Math.min(parseInt(limit, 10) || 100, 500),
    offset: parseInt(offset, 10) || 0,
    action: action || null,
    actorUserId: actorUserId || null,
  });
  res.json({ logs });
}

module.exports = { getAuditLogs };
