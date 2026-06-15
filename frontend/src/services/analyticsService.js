import api from './api';

export const analyticsService = {
  get: (id) => api.get(`/api/analytics/${id}`),
  getPublic: (shortCode) => api.get(`/api/analytics/public/${shortCode}`),
};
