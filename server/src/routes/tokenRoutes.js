import { Router } from 'express';
import {
  createWalkInToken,
  checkInAppointment,
  getUserTokens,
  getTokenDetails,
  updateTokenStatus,
} from '../controllers/tokenController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  generateWalkInTokenSchema,
  checkInAppointmentSchema,
  updateTokenStatusSchema,
} from '../validators/tokenValidator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.post('/walk-in', validate(generateWalkInTokenSchema), createWalkInToken);
router.post('/check-in', validate(checkInAppointmentSchema), checkInAppointment);
router.get('/my', getUserTokens);
router.get('/:id', getTokenDetails);

// Counter / Admin status update
router.patch(
  '/:id/status',
  authorizeRoles(ROLES.ADMIN),
  validate(updateTokenStatusSchema),
  updateTokenStatus
);

export default router;
