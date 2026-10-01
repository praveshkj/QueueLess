import Joi from 'joi';

export const createServiceSchema = Joi.object({
  serviceName: Joi.string().trim().min(2).max(100).required().messages({
    'any.required': 'Service name is required',
  }),
  description: Joi.string().trim().allow(''),
  avgServiceTime: Joi.number().integer().min(1).max(360).required().messages({
    'number.min': 'Average service time must be at least 1 minute',
    'any.required': 'Average service time is required',
  }),
  isActive: Joi.boolean().default(true),
});

export const updateServiceSchema = Joi.object({
  serviceName: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().allow(''),
  avgServiceTime: Joi.number().integer().min(1).max(360),
  isActive: Joi.boolean(),
}).min(1);
