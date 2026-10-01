import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import { Service } from '../models/Service.js';
import { ApiError } from '../utils/ApiError.js';

export const getAllServices = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ serviceName: 1 });
  return sendSuccess(res, 'Services list retrieved', { services }, 200);
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) throw ApiError.notFound('Service not found');
  return sendSuccess(res, 'Service details retrieved', { service }, 200);
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  return sendSuccess(res, 'Service created successfully', { service }, 201);
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) throw ApiError.notFound('Service not found');
  return sendSuccess(res, 'Service updated successfully', { service }, 200);
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) throw ApiError.notFound('Service not found');
  return sendSuccess(res, 'Service deleted successfully', null, 200);
});
