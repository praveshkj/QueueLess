import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));

      const errorMessage = details.map((d) => d.message).join(', ');
      return next(new ApiError(400, errorMessage, 'VALIDATION_ERROR', details));
    }

    // Replace request data with validated & sanitized value
    req[source] = value;
    next();
  };
};
