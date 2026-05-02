import api from './api';

export const projectService = {
  createProject: (name, description) =>
    api.post('/projects', { name, description }),

  getProjects: () =>
    api.get('/projects'),

  getProjectById: (id) =>
    api.get(`/projects/${id}`),

  addMember: (projectId, userId, role) =>
    api.post(`/projects/${projectId}/members`, { userId, role }),

  updateProject: (id, data) =>
    api.put(`/projects/${id}`, data),

  deleteProject: (id) =>
    api.delete(`/projects/${id}`)
};
