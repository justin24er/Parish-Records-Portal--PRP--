// src/routes/documentRoutes.js
// Handles both classic uploads and camera-captured document images.
const express = require('express');
const ctrl = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');
const { upload, setCategory } = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(authenticate);

router.get('/', asyncHandler(ctrl.listDocuments));
router.post('/', setCategory('documents'), upload.single('file'), asyncHandler(ctrl.uploadDocument));
router.get('/:id/file', asyncHandler(ctrl.getDocumentFile));
router.delete('/:id', asyncHandler(ctrl.deleteDocument));

module.exports = router;
