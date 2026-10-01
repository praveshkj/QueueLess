import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { analyticsService } from '../services/analyticsService.js';

export const getOverview = asyncHandler(async (req, res) => {
  const serviceId = req.query.serviceId || null;
  const stats = await analyticsService.getQueueOverviewStats(serviceId);
  return sendSuccess(res, 'Queue overview statistics retrieved', { stats }, 200);
});
