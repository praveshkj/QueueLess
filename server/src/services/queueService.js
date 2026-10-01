import { Token } from '../models/Token.js';
import { Counter } from '../models/Counter.js';
import { TOKEN_STATUS } from '../constants/tokenStatus.js';
import { PRIORITY_LEVELS } from '../constants/priorityLevels.js';
import { ApiError } from '../utils/ApiError.js';

class QueueService {
  /**
   * Retrieves active queue tokens for a service, sorted by priority and FIFO check-in.
   * Priority rule: P1 (On-time Appointment) > P2 (Walk-in) > P3 (Late Appointment).
   * Within same priority: FIFO by checkInTime.
   */
  async getLiveQueue(serviceId) {
    const tokens = await Token.find({
      serviceId,
      status: { $in: [TOKEN_STATUS.WAITING, TOKEN_STATUS.CHECKED_IN, TOKEN_STATUS.IN_SERVICE] },
    })
      .populate('userId', 'name email phone')
      .populate('counterId', 'counterName')
      .lean();

    // Custom multi-level sort to strictly guarantee P1 > P2 > P3, then FIFO checkInTime
    const priorityWeight = {
      [PRIORITY_LEVELS.P1]: 1,
      [PRIORITY_LEVELS.P2]: 2,
      [PRIORITY_LEVELS.P3]: 3,
    };

    return tokens.sort((a, b) => {
      // Tokens already IN_SERVICE stay in their active state
      if (a.status === TOKEN_STATUS.IN_SERVICE && b.status !== TOKEN_STATUS.IN_SERVICE) return -1;
      if (b.status === TOKEN_STATUS.IN_SERVICE && a.status !== TOKEN_STATUS.IN_SERVICE) return 1;

      const pA = priorityWeight[a.priorityLevel] || 2;
      const pB = priorityWeight[b.priorityLevel] || 2;

      if (pA !== pB) {
        return pA - pB; // Lower weight = higher priority
      }

      // Within same priority, strict FIFO based on checkInTime
      return new Date(a.checkInTime) - new Date(b.checkInTime);
    });
  }

  /**
   * Finds the next eligible token in queue according to priority and FIFO rules.
   */
  async getNextEligibleToken(serviceId) {
    const queue = await this.getLiveQueue(serviceId);
    return queue.find((t) => t.status === TOKEN_STATUS.WAITING || t.status === TOKEN_STATUS.CHECKED_IN) || null;
  }

  /**
   * Assigns and calls the next token to an open counter.
   */
  async callNextToken({ counterId, serviceId }) {
    const counter = await Counter.findById(counterId);
    if (!counter || !counter.isOpen) {
      throw ApiError.badRequest('Selected counter is closed or does not exist');
    }

    const nextTokenData = await this.getNextEligibleToken(serviceId || counter.serviceId);
    if (!nextTokenData) {
      return null;
    }

    const token = await Token.findByIdAndUpdate(
      nextTokenData._id,
      {
        status: TOKEN_STATUS.IN_SERVICE,
        counterId: counter._id,
        calledAt: new Date(),
        serviceStartedAt: new Date(),
      },
      { new: true }
    ).populate('userId', 'name email phone');

    return token;
  }
}

export const queueService = new QueueService();
