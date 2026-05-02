import api from './api';

export const authService = {
  signup: (name, email, password, role = 'member') =>
    api.post('/auth/signup', { name, email, password, role }),

  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),

  getProfile: () =>
    api.get('/auth/profile'),

  getMembers: () =>
    api.get('/auth/members')
};
