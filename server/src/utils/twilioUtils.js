import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export const sendOTP = async (phone) => {
  try {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const verification = await client.verify.v2.services(serviceSid)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });
    return verification;
  } catch (error) {
    console.error('Twilio Send OTP Error:', error.message);
    throw error;
  }
};

export const verifyOTP = async (phone, code) => {
  try {
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const verificationCheck = await client.verify.v2.services(serviceSid)
      .verificationChecks
      .create({ to: formattedPhone, code });
    return verificationCheck;
  } catch (error) {
    console.error('Twilio Verify OTP Error:', error.message);
    throw error;
  }
};
