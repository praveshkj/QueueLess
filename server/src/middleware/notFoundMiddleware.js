import { ApiError } from '../utils/ApiError.js';

export const notFoundMiddleware = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
};
