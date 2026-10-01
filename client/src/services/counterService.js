import { api } from './api.js';

export const counterService = {
  getAllCounters: async (serviceId = null) => {
    return await api.get(`/counters${serviceId ? `?serviceId=${serviceId}` : ''}`);
  },

  createCounter: async (counterData) => {
    return await api.post('/counters', counterData);
  },

  updateCounter: async (id, counterData) => {
    return await api.patch(`/counters/${id}`, counterData);
  },
};
