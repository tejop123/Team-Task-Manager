import api from './api';

export const taskService = {
  createTask: (data) =>
    api.post('/tasks', data),

  getTasks: (params) =>
    api.get('/tasks', { params }),

  getTaskById: (id) =>
    api.get(`/tasks/${id}`),

  updateTask: (id, data) =>
    api.put(`/tasks/${id}`, data),

  deleteTask: (id) =>
    api.delete(`/tasks/${id}`),

  getDashboard: () =>
    api.get('/tasks/dashboard'),

  getAssignedTasks: () =>
    api.get('/tasks/assigned')
};
