import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { Counter } from '../models/Counter.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllCounters = asyncHandler(async (req, res) => {
  const filter = req.query.serviceId ? { serviceId: req.query.serviceId } : {};
  const counters = await Counter.find(filter).populate('serviceId', 'serviceName');
  return sendSuccess(res, 'Counters retrieved', { counters }, 200);
});

export const createCounter = asyncHandler(async (req, res) => {
  if (!req.body.serviceId && req.body.assignedServiceId) {
    req.body.serviceId = req.body.assignedServiceId;
  }
  const counter = await (await Counter.create(req.body)).populate('serviceId', 'serviceName');
  return sendSuccess(res, 'Counter created successfully', { counter }, 201);
});

export const updateCounter = asyncHandler(async (req, res) => {
  if (!req.body.serviceId && req.body.assignedServiceId) {
    req.body.serviceId = req.body.assignedServiceId;
  }
  const counter = await Counter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('serviceId', 'serviceName');
  if (!counter) throw ApiError.notFound('Counter not found');
  return sendSuccess(res, 'Counter updated successfully', { counter }, 200);
});
