import Joi from 'joi';

export const bookAppointmentSchema = Joi.object({
  serviceId: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid service ID format',
    'any.required': 'Service ID is required',
  }),
  slotTime: Joi.date().iso().greater('now').required().messages({
    'date.greater': 'Appointment slot must be in the future',
    'any.required': 'Slot time is required',
  }),
});
