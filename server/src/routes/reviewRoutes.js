import express from 'express';
import { createReview, editReview, markHelpful } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.patch('/:id', protect, editReview);
router.post('/:id/helpful', markHelpful); // No auth needed to mark as helpful? Or protect it? Let's leave public for now.

export default router;
