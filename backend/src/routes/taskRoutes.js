const express = require('express');
const { body } = require('express-validator');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboard
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

const router = express.Router();

router.post('/', auth, checkRole(['admin']), [
  body('title', 'Task title is required').trim().notEmpty(),
  body('projectId', 'Project ID is required').notEmpty(),
  body('priority', 'Priority must be low, medium, high, or urgent').optional().isIn(['low', 'medium', 'high', 'urgent'])
], createTask);

router.get('/dashboard', auth, getDashboard);

router.get('/', auth, getTasks);

router.get('/:id', auth, getTaskById);

router.put('/:id', auth, [
  body('status', 'Invalid status').optional().isIn(['todo', 'in-progress', 'completed', 'on-hold']),
  body('priority', 'Invalid priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], updateTask);

router.delete('/:id', auth, checkRole(['admin']), deleteTask);

module.exports = router;
