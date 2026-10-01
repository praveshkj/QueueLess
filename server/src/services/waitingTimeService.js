import { Token } from '../models/Token.js';
import { Service } from '../models/Service.js';
import { TOKEN_STATUS } from '../constants/tokenStatus.js';
import { PRIORITY_RANKING } from '../constants/priorityLevels.js';

/**
 * WaitingTimeService handles waiting time estimation.
 * Current algorithm:
 *   Estimated Waiting Time = (Eligible customers ahead) * (Average service time of service)
 *
 * NOTE FOR FUTURE AI/ML EXTENSION:
 * This service is designed to be easily swappable or augmentable with an ML-based regression model
 * (e.g. historical queue throughput, time-of-day dynamics, counter staffing levels) without
 * altering caller signatures.
 */
class WaitingTimeService {
  /**
   * Calculate waiting time for a given token or position in queue.
   * @param {string} serviceId
   * @param {Object} currentToken - Token object with priorityLevel and checkInTime
   * @returns {Promise<{ estimatedMinutes: number, customersAhead: number, avgServiceTime: number }>}
   */
  async calculateEstimatedWaitingTime(serviceId, currentToken) {
    const service = await Service.findById(serviceId);
    const avgServiceTime = service ? service.avgServiceTime : 15;

    // Get all active waiting/checked-in tokens for this service
    const activeTokens = await Token.find({
      serviceId,
      status: { $in: [TOKEN_STATUS.WAITING, TOKEN_STATUS.CHECKED_IN] },
    }).lean();

    const currentRank = PRIORITY_RANKING[currentToken.priorityLevel] || 2;
    const currentCheckIn = new Date(currentToken.checkInTime).getTime();

    // Count customers who are strictly ahead based on priority, then FIFO checkInTime
    let customersAhead = 0;
    for (const token of activeTokens) {
      if (token._id.toString() === currentToken._id?.toString()) continue;

      const tokenRank = PRIORITY_RANKING[token.priorityLevel] || 2;
      const tokenCheckIn = new Date(token.checkInTime).getTime();

      if (tokenRank < currentRank) {
        // Higher priority ahead
        customersAhead++;
      } else if (tokenRank === currentRank && tokenCheckIn < currentCheckIn) {
        // Same priority but arrived earlier (FIFO)
        customersAhead++;
      }
    }

    const estimatedMinutes = customersAhead * avgServiceTime;

    return {
      estimatedMinutes,
      customersAhead,
      avgServiceTime,
    };
  }

  /**
   * Quick estimation based solely on number of people currently waiting in service queue
   * @param {string} serviceId
   */
  async getQueueWaitSummary(serviceId) {
    const service = await Service.findById(serviceId);
    if (!service) return { estimatedMinutes: 0, waitingCount: 0, avgServiceTime: 0 };

    const waitingCount = await Token.countDocuments({
      serviceId,
      status: { $in: [TOKEN_STATUS.WAITING, TOKEN_STATUS.CHECKED_IN] },
    });

    return {
      waitingCount,
      avgServiceTime: service.avgServiceTime,
      estimatedMinutes: waitingCount * service.avgServiceTime,
    };
  }
}

export const waitingTimeService = new WaitingTimeService();
