import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { initSocket } from './sockets/socket.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Create HTTP Server
  const server = http.createServer(app);

  // 3. Initialize WebSocket Server Foundation
  initSocket(server);

  // 4. Start Listening
  server.listen(env.PORT, () => {
    logger.info(`QueueLess Server listening on port ${env.PORT} in [${env.NODE_ENV}] mode`);
    logger.info(`Health check available at http://localhost:${env.PORT}/api/v1/health`);
  });

  // Graceful Shutdown Handling
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Gracefully shutting down QueueLess server...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await closeDB();
      process.exit(0);
    });

    // Force close after 10s if graceful shutdown hangs
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection:', { reason });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error: error.message, stack: error.stack });
    process.exit(1);
  });
};

startServer();
