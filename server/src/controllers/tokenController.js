import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { tokenService } from '../services/tokenService.js';

export const createWalkInToken = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;
  const result = await tokenService.generateWalkInToken(req.user.id, serviceId);
  return sendSuccess(res, 'Walk-in token generated successfully', result, 201);
});

export const checkInAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const result = await tokenService.checkInAppointmentToken(req.user.id, appointmentId);
  return sendSuccess(res, 'Appointment checked in successfully', result, 201);
});

export const getUserTokens = asyncHandler(async (req, res) => {
  const tokens = await tokenService.getUserTokens(req.user.id);
  return sendSuccess(res, 'User tokens retrieved', { tokens }, 200);
});

export const getTokenDetails = asyncHandler(async (req, res) => {
  const result = await tokenService.getTokenById(req.params.id);
  return sendSuccess(res, 'Token details retrieved', result, 200);
});

export const updateTokenStatus = asyncHandler(async (req, res) => {
  const { status, counterId } = req.body;
  const token = await tokenService.updateTokenStatus(req.params.id, status, counterId);
  return sendSuccess(res, 'Token status updated', { token }, 200);
});
