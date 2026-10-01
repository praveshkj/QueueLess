import { Token } from '../models/Token.js';
import { TOKEN_STATUS } from '../constants/tokenStatus.js';

class AnalyticsService {
  /**
   * Retrieves high-level queue metrics across services or for a specific service.
   */
  async getQueueOverviewStats(serviceId = null) {
    const filter = serviceId ? { serviceId } : {};

    const [totalTokens, completedTokens, waitingTokens, cancelledTokens, noShowTokens] =
      await Promise.all([
        Token.countDocuments(filter),
        Token.countDocuments({ ...filter, status: TOKEN_STATUS.COMPLETED }),
        Token.countDocuments({
          ...filter,
          status: { $in: [TOKEN_STATUS.WAITING, TOKEN_STATUS.CHECKED_IN] },
        }),
        Token.countDocuments({ ...filter, status: TOKEN_STATUS.CANCELLED }),
        Token.countDocuments({ ...filter, status: TOKEN_STATUS.NO_SHOW }),
      ]);

    return {
      totalTokens,
      completedTokens,
      waitingTokens,
      cancelledTokens,
      noShowTokens,
      throughputRate: totalTokens > 0 ? Math.round((completedTokens / totalTokens) * 100) : 0,
      timestamp: new Date().toISOString(),
    };
  }
}

export const analyticsService = new AnalyticsService();
