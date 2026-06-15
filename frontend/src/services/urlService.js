import api from './api';

export const urlService = {
  create: (data) => api.post('/api/urls', data),
  getAll: () => api.get('/api/urls'),
  delete: (id) => api.delete(`/api/urls/${id}`),
};
