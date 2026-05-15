import { sendWhatsApp } from "../services/twilio.service.js";
import WhatsappSession from "../models/WhatsappSession.js";

/**
 * @desc    WhatsApp Webhook
 * @route   POST /api/webhook/whatsapp
 * @access  Public (Twilio)
 */
export const handleWhatsAppWebhook = async (req, res) => {
  const { Body, From } = req.body;
  const phone = From.replace("whatsapp:", "");

  try {
    // This is just a placeholder for the bot flow
    // Full logic will be implemented in Part 4
    console.log(`Message from ${phone}: ${Body}`);

    // Echo for now
    await sendWhatsApp(phone, `You said: ${Body}. Bot flow coming soon!`);

    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
};
