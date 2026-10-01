import { Router } from 'express';
import { getLiveQueue, getQueueSummary, callNextToken } from '../controllers/queueController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public / Authenticated queue viewing
router.get('/:serviceId/live', getLiveQueue);
router.get('/:serviceId/summary', getQueueSummary);

// Admin / Counter queue management
router.post('/call-next', authenticate, authorizeRoles(ROLES.ADMIN), callNextToken);

export default router;
