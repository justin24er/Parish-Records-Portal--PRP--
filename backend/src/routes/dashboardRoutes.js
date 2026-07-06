// src/routes/dashboardRoutes.js
const express = require('express');
const ctrl = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();
router.use(authenticate);
router.get('/stats', asyncHandler(ctrl.getStats));
router.get('/activities', asyncHandler(ctrl.getActivities));

module.exports = router;
