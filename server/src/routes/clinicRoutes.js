import express from 'express';
import { 
  getNearbyClinics, getClinicBySlug, 
  getClinicDoctors, getClinicReviews 
} from '../controllers/clinicController.js';

const router = express.Router();

router.get('/nearby', getNearbyClinics);
router.get('/:slug', getClinicBySlug);
router.get('/:id/doctors', getClinicDoctors);
router.get('/:id/reviews', getClinicReviews);

export default router;
