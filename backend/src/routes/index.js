// src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/documents', require('./documentRoutes'));
router.use('/vitabu', require('./vitabuRoutes'));
router.use('/audit-logs', require('./auditRoutes'));

router.get('/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

module.exports = router;
