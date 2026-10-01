import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let details = err.details || null;

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id: ${err.value}`;
    code = 'INVALID_ID';
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${field}. Please use another value.`;
    code = 'DUPLICATE_KEY';
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errorDetails = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    message = errorDetails.map((d) => d.message).join(', ');
    code = 'VALIDATION_ERROR';
    details = errorDetails;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
    code = 'TOKEN_EXPIRED';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, {
      stack: err.stack,
      statusCode,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - ${message}`, {
      statusCode,
      code,
    });
  }

  const errorResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV !== 'production' && statusCode >= 500 ? { stack: err.stack } : {}),
    },
  };

  res.status(statusCode).json(errorResponse);
};
