import express from 'express';
import { register, verifyEmail, login, refreshToken, logout } from '../controllers/clinicAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);

export default router;
