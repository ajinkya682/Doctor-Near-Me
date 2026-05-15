import express from "express";
const router = express.Router();
import { handleWhatsAppWebhook } from "../controllers/webhook.controller.js";

router.post("/whatsapp", handleWhatsAppWebhook);

export default router;
