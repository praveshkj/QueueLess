import { verifyToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Authentication token is required'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Malformed authorization header'));
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token has expired, please log in again', 'TOKEN_EXPIRED'));
      }
      return next(ApiError.unauthorized('Invalid authentication token', 'INVALID_TOKEN'));
    }

    // Retrieve user from DB to ensure user still exists and role hasn't changed
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return next(ApiError.unauthorized('User associated with this token no longer exists'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
