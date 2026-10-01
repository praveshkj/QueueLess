import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import tokenRoutes from './tokenRoutes.js';
import queueRoutes from './queueRoutes.js';
import counterRoutes from './counterRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

// Health Check Endpoint
router.get('/health', (req, res) => {
  return sendSuccess(res, 'QueueLess API is healthy and operational', {
    status: 'UP',
    version: 'v1',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/tokens', tokenRoutes);
router.use('/queue', queueRoutes);
router.use('/counters', counterRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
