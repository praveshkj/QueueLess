import { Router } from 'express';
import { getAllCounters, createCounter, updateCounter } from '../controllers/counterController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createCounterSchema, updateCounterStatusSchema } from '../validators/counterValidator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public / Authenticated read
router.get('/', getAllCounters);

// Admin-only management
router.post(
  '/',
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  validate(createCounterSchema),
  createCounter
);

router.patch(
  '/:id',
  authenticate,
  authorizeRoles(ROLES.ADMIN),
  validate(updateCounterStatusSchema),
  updateCounter
);

export default router;
