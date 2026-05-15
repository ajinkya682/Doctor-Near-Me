import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

/**
 * Send OTP via Twilio Verify
 */
export const sendOTP = async (phone) => {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });
    return verification;
  } catch (error) {
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

/**
 * Check OTP via Twilio Verify
 */
export const checkOTP = async (phone, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code });
    return verificationCheck.status === "approved";
  } catch (error) {
    throw new Error(`Failed to verify OTP: ${error.message}`);
  }
};

/**
 * Send WhatsApp Message
 */
export const sendWhatsApp = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
    });
    return message;
  } catch (error) {
    console.error(`WhatsApp Error: ${error.message}`);
    // We don't throw here to avoid breaking the booking flow if WhatsApp fails
  }
};
