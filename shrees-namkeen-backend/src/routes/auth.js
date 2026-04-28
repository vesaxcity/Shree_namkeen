const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

const router = express.Router();

router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password',
  protect,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  validate,
  changePassword
);
router.post('/logout', protect, logout);

module.exports = router;
