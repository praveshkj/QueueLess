import Joi from 'joi';

export const createCounterSchema = Joi.object({
  counterName: Joi.string().trim().min(1).max(50).required().messages({
    'any.required': 'Counter name is required',
  }),
  serviceId: Joi.string().hex().length(24).messages({
    'string.length': 'Invalid service ID format',
    'any.required': 'Assigned service ID is required',
  }),
  assignedServiceId: Joi.string().hex().length(24).messages({
    'string.length': 'Invalid service ID format',
  }),
  isOpen: Joi.boolean().default(true),
}).or('serviceId', 'assignedServiceId');

export const updateCounterStatusSchema = Joi.object({
  counterName: Joi.string().trim().min(1).max(50),
  serviceId: Joi.string().hex().length(24),
  assignedServiceId: Joi.string().hex().length(24),
  isOpen: Joi.boolean(),
}).min(1);
