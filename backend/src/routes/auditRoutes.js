// src/routes/auditRoutes.js
const express = require('express');
const ctrl = require('../controllers/auditController');
const { authenticate, requireSuperAdmin } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(authenticate, requireSuperAdmin);
router.get('/', asyncHandler(ctrl.getAuditLogs));

module.exports = router;
