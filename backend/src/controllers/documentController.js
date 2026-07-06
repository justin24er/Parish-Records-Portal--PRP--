// src/controllers/documentController.js
// Backing endpoint for both (a) classic file-picker uploads and (b) the
// in-browser camera capture widget, which POSTs the captured JPEG blob here
// exactly like a normal multipart upload.

const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');
const { logAction } = require('../utils/audit');
const { UPLOAD_ROOT } = require('../middleware/upload');

async function uploadDocument(req, res) {
  if (!req.file) return res.status(400).json({ message: 'Hakuna faili lililotumwa.' });

  const { kitabuId, ownerType = 'general', ownerId = null, source = 'upload' } = req.body;
  const id = uuidv4();
  const relativePath = path.join(req.uploadCategory || 'documents', req.file.filename);

  db.prepare(`
    INSERT INTO documents (id, parish_id, kitabu_id, owner_type, owner_id, file_name, file_path, mime_type, size_bytes, source, uploaded_by)
    VALUES (@id, @parishId, @kitabuId, @ownerType, @ownerId, @fileName, @filePath, @mimeType, @sizeBytes, @source, @uploadedBy)
  `).run({
    id,
    parishId: req.user.parish_id,
    kitabuId: kitabuId || null,
    ownerType,
    ownerId,
    fileName: req.file.originalname,
    filePath: relativePath,
    mimeType: req.file.mimetype,
    sizeBytes: req.file.size,
    source: source === 'camera' ? 'camera' : 'upload',
    uploadedBy: req.user.id,
  });

  logAction({
    actorUserId: req.user.id,
    actorEmail: req.user.email,
    action: 'document.upload',
    targetType: 'document',
    targetId: id,
    metadata: { fileName: req.file.originalname, source },
    req,
  });

  res.status(201).json({
    document: db.prepare('SELECT * FROM documents WHERE id = ?').get(id),
  });
}

async function listDocuments(req, res) {
  const { ownerType, ownerId, kitabuId } = req.query;
  let q = 'SELECT * FROM documents WHERE parish_id = @parishId';
  const params = { parishId: req.user.parish_id };
  if (ownerType) { q += ' AND owner_type = @ownerType'; params.ownerType = ownerType; }
  if (ownerId) { q += ' AND owner_id = @ownerId'; params.ownerId = ownerId; }
  if (kitabuId) { q += ' AND kitabu_id = @kitabuId'; params.kitabuId = kitabuId; }
  q += ' ORDER BY created_at DESC';
  res.json({ documents: db.prepare(q).all(params) });
}

async function getDocumentFile(req, res) {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Faili halipatikani.' });
  // Parish-scoped access check (super_admin bypasses).
  if (req.user.role !== 'super_admin' && doc.parish_id !== req.user.parish_id) {
    return res.status(403).json({ message: 'Huna ruhusa kufikia faili hili.' });
  }
  const fullPath = path.join(UPLOAD_ROOT, doc.file_path);
  if (!fs.existsSync(fullPath)) return res.status(404).json({ message: 'Faili halipo kwenye seva.' });
  res.sendFile(fullPath);
}

async function deleteDocument(req, res) {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Faili halipatikani.' });
  if (req.user.role !== 'super_admin' && doc.parish_id !== req.user.parish_id) {
    return res.status(403).json({ message: 'Huna ruhusa.' });
  }
  const fullPath = path.join(UPLOAD_ROOT, doc.file_path);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  db.prepare('DELETE FROM documents WHERE id = ?').run(doc.id);
  logAction({ actorUserId: req.user.id, actorEmail: req.user.email, action: 'document.delete', targetType: 'document', targetId: doc.id, req });
  res.json({ ok: true });
}

module.exports = { uploadDocument, listDocuments, getDocumentFile, deleteDocument };
