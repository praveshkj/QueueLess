import { Router } from 'express';
import { getProfile, updateProfile, getAllUsers } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateProfileSchema } from '../validators/userValidator.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);

// Admin-only route
router.get('/', authorizeRoles(ROLES.ADMIN), getAllUsers);

export default router;
