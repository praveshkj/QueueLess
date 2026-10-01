/**
 * Wraps asynchronous controller functions to eliminate try-catch boilerplate
 * and forward unhandled rejections to the centralized error middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
