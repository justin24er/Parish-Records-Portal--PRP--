// src/routes/vitabuRoutes.js
const express = require('express');
const ctrl = require('../controllers/vitabuController');
const { authenticate, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(authenticate);

router.get('/', asyncHandler(ctrl.listVitabu));
router.post('/', requireRole('admin'), asyncHandler(ctrl.createVitabu));

module.exports = router;
