import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

// Public routes for viewing services
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Admin-only management routes
router.post('/', authenticate, authorizeRoles(ROLES.ADMIN), validate(createServiceSchema), createService);
router.patch('/:id', authenticate, authorizeRoles(ROLES.ADMIN), validate(updateServiceSchema), updateService);
router.delete('/:id', authenticate, authorizeRoles(ROLES.ADMIN), deleteService);

export default router;
