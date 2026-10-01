import { api } from './api.js';

export const serviceService = {
  getAllServices: async (includeInactive = false) => {
    return await api.get(`/services${includeInactive ? '?all=true' : ''}`);
  },

  getServiceById: async (id) => {
    return await api.get(`/services/${id}`);
  },

  createService: async (serviceData) => {
    return await api.post('/services', serviceData);
  },

  updateService: async (id, serviceData) => {
    return await api.patch(`/services/${id}`, serviceData);
  },

  deleteService: async (id) => {
    return await api.delete(`/services/${id}`);
  },
};
