const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the project admin can create tasks' });
    }

    const task = new Task({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.user.id,
      priority,
      dueDate
    });

    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status, assignedTo } = req.query;

    let query = {};

    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const isMember = project.members.some(m => m.userId.toString() === req.user.id);
      if (!isMember && project.admin.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      query.project = projectId;
    }

    if (req.user.role === 'admin') {
      const adminProjects = await Project.find({ admin: req.user.id }).select('_id');
      const adminProjectIds = adminProjects.map(project => project._id);
      query.project = projectId ? projectId : { $in: adminProjectIds };
    } else {
      query.assignedTo = req.user.id;
    }

    if (status) query.status = status;
    if (assignedTo && req.user.role === 'admin') query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isProjectAdmin = project.admin.toString() === req.user.id;
    const isAssignedMember = task.assignedTo && task.assignedTo._id.toString() === req.user.id;

    if (!isProjectAdmin && !isAssignedMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    const isProjectAdmin = project.admin.toString() === req.user.id;
    const isAssignedMember = task.assignedTo && task.assignedTo.toString() === req.user.id;

    if (!isProjectAdmin && !isAssignedMember) {
      return res.status(403).json({ message: 'You cannot update this task' });
    }

    if (isProjectAdmin) {
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (status) task.status = status;
      if (priority) task.priority = priority;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
      if (dueDate !== undefined) task.dueDate = dueDate;
    } else {
      const allowedFields = ['status'];
      const requestedFields = Object.keys(req.body);
      const hasBlockedField = requestedFields.some(field => !allowedFields.includes(field));

      if (hasBlockedField) {
        return res.status(403).json({ message: 'Members can only update task status' });
      }

      if (status !== 'completed') {
        return res.status(403).json({ message: 'Members can only mark assigned tasks as completed' });
      }

      task.status = status;
    }

    task.updatedAt = Date.now();
    await task.save();
    await task.populate(['project', 'assignedTo', 'createdBy']);

    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (project.admin.toString() !== req.user.id && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You cannot delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const userProjects = await Project.find(req.user.role === 'admin'
      ? { admin: req.user.id }
      : { 'members.userId': req.user.id }
    );

    const projectIds = userProjects.map(p => p._id);

    const taskQuery = req.user.role === 'admin'
      ? { project: { $in: projectIds } }
      : { assignedTo: req.user.id };

    const tasks = await Task.find(taskQuery)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    const now = new Date();

    const stats = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      todoTasks: tasks.filter(t => t.status === 'todo').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      onHoldTasks: tasks.filter(t => t.status === 'on-hold').length,
      overdueTasks: tasks.filter(t => t.dueDate && t.dueDate < now && t.status !== 'completed').length
    };

    const assignedTasks = tasks.filter(t => t.assignedTo && t.assignedTo._id.toString() === req.user.id);

    res.json({
      stats,
      assignedTasks,
      projects: userProjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboard
};
