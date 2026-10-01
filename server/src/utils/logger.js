/**
 * Structured logger abstraction for QueueLess.
 * Provides clean development output and structured JSON logs in production.
 */

const isProd = process.env.NODE_ENV === 'production';

const formatLog = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  if (isProd) {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
    });
  }

  const metaStr = meta && Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

export const logger = {
  info: (message, meta) => {
    console.log(formatLog('info', message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatLog('warn', message, meta));
  },
  error: (message, meta) => {
    console.error(formatLog('error', message, meta));
  },
  debug: (message, meta) => {
    if (process.env.LOG_LEVEL === 'debug' || !isProd) {
      console.debug(formatLog('debug', message, meta));
    }
  },
};
