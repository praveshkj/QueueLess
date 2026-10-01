import { api } from './api.js';

export const queueService = {
  getLiveQueue: async (serviceId) => {
    return await api.get(`/queue/${serviceId}/live`);
  },

  getQueueSummary: async (serviceId) => {
    return await api.get(`/queue/${serviceId}/summary`);
  },

  callNextToken: async (counterId, serviceId) => {
    return await api.post('/queue/call-next', { counterId, serviceId });
  },
};
