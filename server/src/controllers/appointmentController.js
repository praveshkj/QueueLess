import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { appointmentService } from '../services/appointmentService.js';
import { ROLES } from '../constants/roles.js';

export const bookAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.bookAppointment({
    userId: req.user.id,
    serviceId: req.body.serviceId,
    slotTime: req.body.slotTime,
  });
  return sendSuccess(res, 'Appointment booked successfully', { appointment }, 201);
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getUserAppointments(req.user.id);
  return sendSuccess(res, 'User appointments retrieved', { appointments }, 200);
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === ROLES.ADMIN;
  const appointment = await appointmentService.cancelAppointment(
    req.params.id,
    req.user.id,
    isAdmin
  );
  return sendSuccess(res, 'Appointment cancelled', { appointment }, 200);
});
