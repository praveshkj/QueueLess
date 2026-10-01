import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  return sendSuccess(res, 'User profile retrieved', { user }, 200);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { ...(name && { name }), ...(phone && { phone }) },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  return sendSuccess(res, 'Profile updated successfully', { user }, 200);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  return sendSuccess(res, 'Users list retrieved', { users }, 200);
});
