import Joi from 'joi';
import { TOKEN_STATUS_LIST } from '../constants/tokenStatus.js';
import { PRIORITY_LEVEL_LIST } from '../constants/priorityLevels.js';

export const generateWalkInTokenSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid service ID format',
    'any.required': 'Service ID is required',
  }),
});

export const updateTokenStatusSchema = Joi.object({
  status: Joi.string().valid(...TOKEN_STATUS_LIST).required().messages({
    'any.required': 'New status is required',
  }),
  counterId: Joi.string().hex().length(24).optional(),
});

export const checkInAppointmentSchema = Joi.object({
  appointmentId: Joi.string().hex().length(24).required().messages({
    'any.required': 'Appointment ID is required',
  }),
});
