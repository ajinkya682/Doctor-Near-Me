import express from 'express';
import { getDoctorById, getDoctorAvailability, getDoctorReviews } from '../controllers/doctorController.js';

const router = express.Router();

router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.get('/:id/reviews', getDoctorReviews);

export default router;
