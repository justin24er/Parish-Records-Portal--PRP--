// src/utils/audit.js
// Every sensitive action (login, user management, password resets, document
// access) is written here. This table is append-only from the app's point of
// view — there is no update/delete route for it — so it can serve as a real
// audit trail if the system is ever questioned.

const crypto = require('crypto');
const db = require('../config/db');

const insertStmt = db.prepare(`
  INSERT INTO audit_logs (id, actor_user_id, actor_email, action, target_type, target_id, metadata, ip_address, user_agent)
  VALUES (@id, @actor_user_id, @actor_email, @action, @target_type, @target_id, @metadata, @ip_address, @user_agent)
`);

function logAction({
  actorUserId = null,
  actorEmail = null,
  action,
  targetType = null,
  targetId = null,
  metadata = null,
  req = null,
}) {
  try {
    insertStmt.run({
      id: crypto.randomUUID(),
      actor_user_id: actorUserId,
      actor_email: actorEmail,
      action,
      target_type: targetType,
      target_id: targetId,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ip_address: req?.ip || null,
      user_agent: req?.headers?.['user-agent'] || null,
    });
  } catch (err) {
    // Auditing must never crash the request — log and move on.
    console.error('[audit] failed to write audit log:', err.message);
  }
}

function listAuditLogs({ limit = 100, offset = 0, action = null, actorUserId = null } = {}) {
  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params = {};
  if (action) {
    query += ' AND action = @action';
    params.action = action;
  }
  if (actorUserId) {
    query += ' AND actor_user_id = @actorUserId';
    params.actorUserId = actorUserId;
  }
  query += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset';
  params.limit = limit;
  params.offset = offset;
  return db.prepare(query).all(params);
}

module.exports = { logAction, listAuditLogs };
