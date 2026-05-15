import twilio from "twilio";
import config from "../config/config.js";

const client = twilio(
  config.twilio.accountSid,
  config.twilio.authToken
);

const verifyServiceSid = config.twilio.verifyServiceSid;

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
 * Send Standard WhatsApp Message
 */
export const sendWhatsApp = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: config.twilio.whatsappFrom,
      to: `whatsapp:${to}`,
    });
    return message;
  } catch (error) {
    console.error(`WhatsApp Error: ${error.message}`);
  }
};

/**
 * Send WhatsApp List Message
 */
export const sendWhatsAppList = async (to, body, buttonText, sections) => {
  try {
    const message = await client.messages.create({
      from: config.twilio.whatsappFrom,
      to: `whatsapp:${to}`,
      body: `${body}\n\n(Choose an option below)`
    });
    return message;
  } catch (error) {
    console.error(`WhatsApp List Error: ${error.message}`);
  }
};

/**
 * Send WhatsApp Buttons
 */
export const sendWhatsAppButtons = async (to, body, buttons) => {
  try {
    const message = await client.messages.create({
      body: `${body}\n\nOptions: ${buttons.join(', ')}`,
      from: config.twilio.whatsappFrom,
      to: `whatsapp:${to}`,
    });
    return message;
  } catch (error) {
    console.error(`WhatsApp Buttons Error: ${error.message}`);
  }
};
