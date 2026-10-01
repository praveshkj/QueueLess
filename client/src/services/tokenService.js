import { api } from './api.js';

export const tokenService = {
  createWalkInToken: async (serviceId) => {
    return await api.post('/tokens/walk-in', { serviceId });
  },

  checkInAppointment: async (appointmentId) => {
    return await api.post('/tokens/check-in', { appointmentId });
  },

  getMyTokens: async () => {
    return await api.get('/tokens/my');
  },

  getTokenById: async (id) => {
    return await api.get(`/tokens/${id}`);
  },

  updateTokenStatus: async (id, status, counterId = null) => {
    return await api.patch(`/tokens/${id}/status`, { status, counterId });
  },
};
