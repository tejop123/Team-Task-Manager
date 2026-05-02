const express = require('express');
const { body } = require('express-validator');
const { signup, login, getProfile, getMembers } = require('../controllers/authController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.post('/signup', [
  body('name', 'Name is required').trim().notEmpty(),
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  body('role', 'Role must be admin or member').optional().isIn(['admin', 'member'])
], signup);

router.post('/login', [
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password is required').notEmpty(),
  body('role', 'Role must be admin or member').optional().isIn(['admin', 'member'])
], login);

router.get('/profile', auth, getProfile);

router.get('/members', auth, checkRole(['admin']), getMembers);

module.exports = router;
