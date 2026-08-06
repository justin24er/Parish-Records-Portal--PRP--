// src/middleware/upload.js
// Handles both classic file-picker uploads and camera-captured snapshots
// (the frontend converts the camera canvas to a JPEG blob and sends it here
// exactly like a normal file upload).

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const env = require('../config/env');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');
const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

for (const sub of ['documents', 'certificates', 'avatars']) {
  const dir = path.join(UPLOAD_ROOT, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const sub = req.uploadCategory || 'documents';
    cb(null, path.join(UPLOAD_ROOT, sub));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || guessExt(file.mimetype);
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

function guessExt(mime) {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'application/pdf') return '.pdf';
  return '';
}

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new Error('Aina ya faili haiwezekani. Ruhusiwa: JPG, PNG, WEBP, PDF.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
});

// Middleware to tag which sub-folder a route should store into.
function setCategory(category) {
  return (req, res, next) => {
    req.uploadCategory = category;
    next();
  };
}

module.exports = { upload, setCategory, UPLOAD_ROOT };
