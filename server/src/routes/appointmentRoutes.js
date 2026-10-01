import { Router } from 'express';
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { bookAppointmentSchema } from '../validators/appointmentValidator.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(bookAppointmentSchema), bookAppointment);
router.get('/my', getMyAppointments);
router.patch('/:id/cancel', cancelAppointment);

export default router;
