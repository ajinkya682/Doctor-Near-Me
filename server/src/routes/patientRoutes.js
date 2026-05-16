import express from 'express';
import { 
  getProfile, updateProfile, uploadPhoto, 
  getSavedClinics, saveClinic, unsaveClinic,
  getNotifications, markNotificationRead, markAllNotificationsRead 
} from '../controllers/patientController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Protect all patient routes

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.post('/profile/photo', uploadPhoto);
router.get('/saved-clinics', getSavedClinics);
router.post('/saved-clinics/:clinicId', saveClinic);
router.delete('/saved-clinics/:clinicId', unsaveClinic);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);

export default router;
