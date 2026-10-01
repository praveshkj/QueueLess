import { logger } from '../utils/logger.js';

/**
 * Socket.IO preparation for QueueLess
 * Defines real-time event constants and architecture placeholder for WebSocket handlers.
 */

export const SOCKET_EVENTS = {
  QUEUE_UPDATED: 'queue:updated',
  TOKEN_CALLED: 'token:called',
  TOKEN_COMPLETED: 'token:completed',
  WAITING_TIME_UPDATED: 'waiting_time:updated',
  NOTIFICATION: 'notification:received',
};

let ioInstance = null;

export const initSocket = (httpServer) => {
  logger.info('[Socket.IO] Real-time engine foundation initialized (ready for active clients)');
  // Future implementation:
  // ioInstance = new Server(httpServer, { cors: { origin: env.CLIENT_URL } });
  // ioInstance.on('connection', (socket) => { ... });
  return ioInstance;
};

export const getIO = () => {
  return ioInstance;
};

export const emitQueueUpdated = (serviceId, queueData) => {
  if (ioInstance) {
    ioInstance.to(`service:${serviceId}`).emit(SOCKET_EVENTS.QUEUE_UPDATED, queueData);
  }
};

export const emitTokenCalled = (userId, callData) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(SOCKET_EVENTS.TOKEN_CALLED, callData);
  }
};
