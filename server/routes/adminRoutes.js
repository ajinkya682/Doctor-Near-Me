import express from 'express';
import { approveClinicOwner } from '../controllers/adminController.js';
import { protect, adminProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/clinic-owners/:id/approve', protect, adminProtect, approveClinicOwner);

export default router;
