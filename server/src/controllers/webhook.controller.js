import { handleBotFlow } from "../services/bot.service.js";

/**
 * @desc    WhatsApp Webhook
 * @route   POST /api/webhook/whatsapp
 * @access  Public (Twilio)
 */
export const handleWhatsAppWebhook = async (req, res) => {
  const { Body, From, Latitude, Longitude } = req.body;
  
  // From is in format "whatsapp:+9188..."
  const phone = From.replace("whatsapp:", "");

  try {
    // Process the message through the bot state machine
    await handleBotFlow(
      phone, 
      Body, 
      Latitude ? parseFloat(Latitude) : null, 
      Longitude ? parseFloat(Longitude) : null
    );
    
    // Twilio expects a 200 OK response
    res.status(200).send("OK");
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};
