import { api } from './api.js';

export const appointmentService = {
  bookAppointment: async (appointmentData) => {
    return await api.post('/appointments', appointmentData);
  },

  getMyAppointments: async () => {
    return await api.get('/appointments/my');
  },

  cancelAppointment: async (id) => {
    return await api.patch(`/appointments/${id}/cancel`);
  },
};
