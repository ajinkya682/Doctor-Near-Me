import express from 'express';
import { handleWhatsAppWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Twilio calls this POST route
router.post('/whatsapp', handleWhatsAppWebhook);

export default router;
