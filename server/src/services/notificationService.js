import { logger } from '../utils/logger.js';

/**
 * NotificationService
 * Placeholder / foundation for future notification delivery (SMS, Email, WebPush, Socket).
 */
class NotificationService {
  async sendTokenCalledNotification(user, token, counter) {
    logger.info(`[NotificationService] Token called notification sent to ${user.email} for Token ${token.tokenNumber} at Counter ${counter.counterName}`);
    return { delivered: true, channel: 'in-app' };
  }

  async sendAppointmentConfirmation(user, appointment) {
    logger.info(`[NotificationService] Appointment confirmation notification sent to ${user.email}`);
    return { delivered: true, channel: 'email' };
  }

  async sendWaitTimeAlert(user, token, minutesRemaining) {
    logger.info(`[NotificationService] Wait time alert sent to ${user.email}: ~${minutesRemaining} minutes remaining.`);
    return { delivered: true, channel: 'push' };
  }
}

export const notificationService = new NotificationService();
