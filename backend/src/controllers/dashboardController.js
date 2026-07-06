// src/controllers/dashboardController.js
const db = require('../config/db');

async function getStats(req, res) {
  const parishId = req.user.role === 'super_admin' ? req.query.parishId || null : req.user.parish_id;
  const scope = parishId ? 'AND parish_id = @parishId' : '';
  const params = { parishId };

  const waumini = db.prepare(`SELECT COUNT(*) c FROM waumini WHERE 1=1 ${scope}`).get(params).c;
  const sakramenti = db.prepare(`SELECT COUNT(*) c FROM sakramenti WHERE 1=1 ${scope}`).get(params).c;
  const vyeti = db.prepare(`SELECT COUNT(*) c FROM documents WHERE 1=1 ${parishId ? 'AND parish_id = @parishId' : ''}`).get(params).c;
  const watumiaji = db.prepare(`SELECT COUNT(*) c FROM users WHERE is_active = 1 ${scope}`).get(params).c;

  res.json({
    stats: [
      { label: 'Waumini', value: waumini, icon: 'Users', colorClass: 'stat-blue' },
      { label: 'Sakramenti', value: sakramenti, icon: 'Droplets', colorClass: 'stat-green' },
      { label: 'Nyaraka/Vyeti', value: vyeti, icon: 'FileText', colorClass: 'stat-gold' },
      { label: 'Watumiaji Hai', value: watumiaji, icon: 'BookOpen', colorClass: 'stat-purple' },
    ],
  });
}

async function getActivities(req, res) {
  const parishId = req.user.role === 'super_admin' ? null : req.user.parish_id;
  const rows = db
    .prepare(`
      SELECT a.action, a.created_at, a.metadata, u.full_name as actor_name
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.actor_user_id
      ${parishId ? 'WHERE u.parish_id = @parishId' : ''}
      ORDER BY a.created_at DESC LIMIT 20
    `)
    .all({ parishId });
  res.json({ activities: rows });
}

module.exports = { getStats, getActivities };
