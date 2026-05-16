import express from 'express';
import { 
  createClinic, getOwnerClinics, updateClinic, 
  addDoctorToClinic, updateDoctor, deleteDoctor,
  getOwnerAppointments, updateAppointmentStatus, 
  getAnalytics, replyToReview
} from '../controllers/clinicOwnerController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Should also have a clinicOwner check if we had multiple roles

router.post('/clinics', createClinic);
router.get('/clinics', getOwnerClinics);
router.patch('/clinics/:id', updateClinic);
router.post('/clinics/:id/doctors', addDoctorToClinic);
router.patch('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.get('/appointments', getOwnerAppointments);
router.patch('/appointments/:id/:status', updateAppointmentStatus); // confirmed, cancelled, completed
router.get('/analytics', getAnalytics);
router.post('/reviews/:id/reply', replyToReview);

export default router;
