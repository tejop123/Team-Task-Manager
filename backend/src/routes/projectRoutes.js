const express = require('express');
const { body } = require('express-validator');
const {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', auth, checkRole(['admin']), [
  body('name', 'Project name is required').trim().notEmpty()
], createProject);

router.get('/', auth, getProjects);

router.get('/:id', auth, getProjectById);

router.post('/:id/members', auth, checkRole(['admin']), [
  body('userId', 'User ID is required').notEmpty(),
  body('role', 'Role must be admin or member').isIn(['admin', 'member'])
], addMember);

router.put('/:id', auth, checkRole(['admin']), [
  body('status', 'Status must be active, completed, or archived').optional().isIn(['active', 'completed', 'archived'])
], updateProject);

router.delete('/:id', auth, checkRole(['admin']), deleteProject);

module.exports = router;
