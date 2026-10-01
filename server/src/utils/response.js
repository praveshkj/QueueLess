/**
 * Standardized API response format helpers
 */

export const sendSuccess = (res, message = 'Operation successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'An error occurred', error = {}, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
