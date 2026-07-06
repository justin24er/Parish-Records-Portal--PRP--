// src/controllers/vitabuController.js
// "Vitabu vya Kanisa" = church registry book categories (Baptism register,
// Marriage register, etc). Each kitabu groups sacrament records and scanned
// document pages so registries stay organized instead of one big pile of files.

const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { logAction } = require('../utils/audit');

const DEFAULT_BOOKS = [
  { code: 'ubatizo', name_sw: 'Kitabu cha Ubatizo', name_en: 'Baptism Register' },
  { code: 'kipaimara', name_sw: 'Kitabu cha Kipaimara', name_en: 'Confirmation Register' },
  { code: 'ekaristi', name_sw: 'Kitabu cha Ekaristi ya Kwanza', name_en: 'First Communion Register' },
  { code: 'ndoa', name_sw: 'Kitabu cha Ndoa', name_en: 'Marriage Register' },
  { code: 'upadre', name_sw: 'Kitabu cha Upadre', name_en: 'Holy Orders Register' },
  { code: 'mazishi', name_sw: 'Kitabu cha Mazishi', name_en: 'Funeral Register' },
];

async function listVitabu(req, res) {
  const parishId = req.user.parish_id;
  let books = db.prepare('SELECT * FROM vitabu WHERE parish_id = ? ORDER BY name_sw').all(parishId);

  // Auto-provision the standard six registers the first time a parish
  // opens this section, so admins never see an empty screen.
  if (books.length === 0 && parishId) {
    const insert = db.prepare(`
      INSERT INTO vitabu (id, parish_id, code, name_sw, name_en, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const tx = db.transaction((rows) => {
      for (const b of rows) insert.run(uuidv4(), parishId, b.code, b.name_sw, b.name_en, null);
    });
    tx(DEFAULT_BOOKS);
    books = db.prepare('SELECT * FROM vitabu WHERE parish_id = ? ORDER BY name_sw').all(parishId);
  }

  // Attach document counts so the UI can show "12 pages scanned" etc.
  const withCounts = books.map((b) => ({
    ...b,
    document_count: db.prepare('SELECT COUNT(*) c FROM documents WHERE kitabu_id = ?').get(b.id).c,
  }));

  res.json({ vitabu: withCounts });
}

async function createVitabu(req, res) {
  const { code, nameSw, nameEn, description } = req.body;
  if (!code || !nameSw || !nameEn) {
    return res.status(400).json({ message: 'code, nameSw na nameEn vinahitajika.' });
  }
  const id = uuidv4();
  db.prepare(`
    INSERT INTO vitabu (id, parish_id, code, name_sw, name_en, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, req.user.parish_id, code, nameSw, nameEn, description || null);

  logAction({ actorUserId: req.user.id, actorEmail: req.user.email, action: 'vitabu.create', targetType: 'vitabu', targetId: id, req });
  res.status(201).json({ kitabu: db.prepare('SELECT * FROM vitabu WHERE id = ?').get(id) });
}

module.exports = { listVitabu, createVitabu };
