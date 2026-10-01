import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { queueService } from '../services/queueService.js';
import { waitingTimeService } from '../services/waitingTimeService.js';

export const getLiveQueue = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const queue = await queueService.getLiveQueue(serviceId);
  return sendSuccess(res, 'Live queue retrieved', { queue }, 200);
});

export const getQueueSummary = asyncHandler(async (req, res) => {
  const { serviceId } = req.params;
  const summary = await waitingTimeService.getQueueWaitSummary(serviceId);
  return sendSuccess(res, 'Queue summary retrieved', summary, 200);
});

export const callNextToken = asyncHandler(async (req, res) => {
  const { counterId, serviceId } = req.body;
  const token = await queueService.callNextToken({ counterId, serviceId });
  if (!token) {
    return sendSuccess(res, 'No eligible tokens currently waiting in queue', { token: null }, 200);
  }
  return sendSuccess(res, 'Next token called', { token }, 200);
});
