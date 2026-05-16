import express from 'express';
import { 
  getPendingOwners, approveClinicOwner, rejectClinicOwner,
  getAllClinics, verifyClinic, featureClinic,
  getAllUsers, deactivateUser, getAdminAnalytics, getAllReviews
} from '../controllers/adminController.js';
import { protect, adminProtect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, adminProtect);

router.get('/clinic-owners/pending', getPendingOwners);
router.patch('/clinic-owners/:id/approve', approveClinicOwner);
router.patch('/clinic-owners/:id/reject', rejectClinicOwner);

router.get('/clinics', getAllClinics);
router.patch('/clinics/:id/verify', verifyClinic);
router.patch('/clinics/:id/feature', featureClinic);

router.get('/users', getAllUsers);
router.patch('/users/:id/deactivate', deactivateUser);

router.get('/analytics', getAdminAnalytics);
router.get('/reviews', getAllReviews);

export default router;
