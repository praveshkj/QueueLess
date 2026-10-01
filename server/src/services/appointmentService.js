import { Appointment } from '../models/Appointment.js';
import { Service } from '../models/Service.js';
import { ApiError } from '../utils/ApiError.js';
import { APPOINTMENT_STATUS } from '../constants/appointmentStatus.js';

class AppointmentService {
  async bookAppointment({ userId, serviceId, slotTime }) {
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      throw ApiError.badRequest('Service is not active or does not exist');
    }

    const appointment = await Appointment.create({
      userId,
      serviceId,
      slotTime,
      status: APPOINTMENT_STATUS.SCHEDULED,
    });

    return await appointment.populate('serviceId', 'serviceName avgServiceTime');
  }

  async getUserAppointments(userId) {
    return await Appointment.find({ userId })
      .populate('serviceId', 'serviceName avgServiceTime')
      .sort({ slotTime: 1 });
  }

  async cancelAppointment(appointmentId, userId, isAdmin = false) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw ApiError.notFound('Appointment not found');

    if (!isAdmin && appointment.userId.toString() !== userId.toString()) {
      throw ApiError.forbidden('You are not authorized to cancel this appointment');
    }

    appointment.status = APPOINTMENT_STATUS.CANCELLED;
    await appointment.save();
    return appointment;
  }
}

export const appointmentService = new AppointmentService();
