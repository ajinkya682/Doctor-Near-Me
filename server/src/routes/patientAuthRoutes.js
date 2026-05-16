import express from 'express';
import { sendOtp, verifyOtp, completeProfile, refreshToken, logout } from '../controllers/patientAuthController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.patch('/complete-profile', protect, completeProfile);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;
