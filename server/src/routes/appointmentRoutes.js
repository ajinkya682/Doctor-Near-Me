import express from 'express';
import { 
  createAppointment, getPatientAppointments, 
  getAppointmentById, cancelAppointment, rescheduleAppointment 
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createAppointment);
router.get('/', getPatientAppointments);
router.get('/:id', getAppointmentById);
router.patch('/:id/cancel', cancelAppointment);
router.patch('/:id/reschedule', rescheduleAppointment);

export default router;
