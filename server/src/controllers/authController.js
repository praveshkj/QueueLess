import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { authService } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, 'User registered successfully', result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, 'Login successful', result, 200);
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return sendSuccess(res, 'Current user profile retrieved', { user: req.user }, 200);
});
