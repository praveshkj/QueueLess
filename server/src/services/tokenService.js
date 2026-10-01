import { Token } from '../models/Token.js';
import { Service } from '../models/Service.js';
import { Appointment } from '../models/Appointment.js';
import { ApiError } from '../utils/ApiError.js';
import { TOKEN_STATUS } from '../constants/tokenStatus.js';
import { PRIORITY_LEVELS } from '../constants/priorityLevels.js';
import { APPOINTMENT_STATUS } from '../constants/appointmentStatus.js';
import { waitingTimeService } from './waitingTimeService.js';

class TokenService {
  /**
   * Generates a sequential token number for today (e.g. S1-001, S1-002)
   */
  async generateTokenNumber(serviceId) {
    const service = await Service.findById(serviceId);
    if (!service) throw ApiError.notFound('Service not found');

    const prefix = service.serviceName.substring(0, 3).toUpperCase();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const countToday = await Token.countDocuments({
      serviceId,
      createdAt: { $gte: startOfDay },
    });

    const sequence = String(countToday + 1).padStart(3, '0');
    return `${prefix}-${sequence}`;
  }

  /**
   * Generates a walk-in token (Priority: P2 = WALK_IN)
   */
  async generateWalkInToken(userId, serviceId) {
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      throw ApiError.badRequest('Service is currently inactive or not available');
    }

    const tokenNumber = await this.generateTokenNumber(serviceId);

    const token = await Token.create({
      tokenNumber,
      userId,
      serviceId,
      priorityLevel: PRIORITY_LEVELS.P2, // P2 = Walk-in
      status: TOKEN_STATUS.WAITING,
      checkInTime: new Date(),
    });

    const waitEstimation = await waitingTimeService.calculateEstimatedWaitingTime(serviceId, token);

    return {
      token,
      waitEstimation,
    };
  }

  /**
   * Generates or checks-in token from an Appointment
   * Evaluates if on-time (P1) or late (P3)
   */
  async checkInAppointmentToken(userId, appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw ApiError.notFound('Appointment not found');

    if (appointment.userId.toString() !== userId.toString()) {
      throw ApiError.forbidden('You do not own this appointment');
    }

    if (appointment.status === APPOINTMENT_STATUS.CHECKED_IN) {
      throw ApiError.badRequest('Appointment already checked-in');
    }

    // Determine priority level:
    // P1 = On-time appointment (within grace period of 15 minutes past slot)
    // P3 = Late appointment (> 15 minutes past slot)
    const now = new Date();
    const slotTime = new Date(appointment.slotTime);
    const diffMinutes = (now - slotTime) / (1000 * 60);

    const priorityLevel = diffMinutes > 15 ? PRIORITY_LEVELS.P3 : PRIORITY_LEVELS.P1;

    const tokenNumber = await this.generateTokenNumber(appointment.serviceId);

    const token = await Token.create({
      tokenNumber,
      userId,
      serviceId: appointment.serviceId,
      appointmentId: appointment._id,
      priorityLevel,
      status: TOKEN_STATUS.CHECKED_IN,
      checkInTime: now,
    });

    appointment.status = APPOINTMENT_STATUS.CHECKED_IN;
    await appointment.save();

    const waitEstimation = await waitingTimeService.calculateEstimatedWaitingTime(
      appointment.serviceId,
      token
    );

    return {
      token,
      waitEstimation,
    };
  }

  async getTokenById(tokenId) {
    const token = await Token.findById(tokenId)
      .populate('serviceId', 'serviceName avgServiceTime')
      .populate('userId', 'name email phone')
      .populate('counterId', 'counterName');

    if (!token) throw ApiError.notFound('Token not found');

    let waitEstimation = null;
    if (token.status === TOKEN_STATUS.WAITING || token.status === TOKEN_STATUS.CHECKED_IN) {
      waitEstimation = await waitingTimeService.calculateEstimatedWaitingTime(
        token.serviceId._id,
        token
      );
    }

    return { token, waitEstimation };
  }

  async getUserTokens(userId) {
    return await Token.find({ userId })
      .populate('serviceId', 'serviceName avgServiceTime')
      .populate('counterId', 'counterName')
      .sort({ createdAt: -1 });
  }

  async updateTokenStatus(tokenId, newStatus, counterId = null) {
    const token = await Token.findById(tokenId);
    if (!token) throw ApiError.notFound('Token not found');

    token.status = newStatus;
    if (counterId) token.counterId = counterId;

    if (newStatus === TOKEN_STATUS.IN_SERVICE) {
      token.serviceStartedAt = new Date();
    } else if (newStatus === TOKEN_STATUS.COMPLETED) {
      token.servedAt = new Date();
    }

    await token.save();
    return token;
  }
}

export const tokenService = new TokenService();
