import { Router } from 'express';
import { getOverview } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate, authorizeRoles(ROLES.ADMIN));

router.get('/overview', getOverview);

export default router;
