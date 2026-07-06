// src/routes/userRoutes.js
const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/userController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(authenticate, requireRole('admin')); // Katibu/Padre and above only

router.get('/', asyncHandler(ctrl.listUsers));

router.post(
  '/',
  [body('fullName').notEmpty(), body('email').isEmail(), body('role').isIn(['admin', 'secretary', 'viewer', 'super_admin'])],
  validate,
  asyncHandler(ctrl.createUser)
);

router.patch('/:id', asyncHandler(ctrl.updateUser));
router.delete('/:id', asyncHandler(ctrl.deleteUser));
router.post('/:id/force-reset', asyncHandler(ctrl.forceResetPassword));

module.exports = router;
