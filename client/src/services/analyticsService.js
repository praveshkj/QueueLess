import { api } from './api.js';

export const analyticsService = {
  getOverviewStats: async (serviceId = null) => {
    return await api.get(`/analytics/overview${serviceId ? `?serviceId=${serviceId}` : ''}`);
  },
};
