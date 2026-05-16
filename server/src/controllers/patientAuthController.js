import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { sendOTP, verifyOTP } from '../utils/twilioUtils.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/tokenUtils.js';

export const sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    // Normalize: Remove spaces/dashes, ensure it has +91 if it's a 10-digit Indian number
    phone = phone.replace(/\s+/g, '');
    if (phone.length === 10) phone = `+91${phone}`;

    // Validate: Should be +91 followed by 10 digits (Total 13)
    if (!/^\+91\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid Indian phone number. Must be 10 digits.' });
    }

    await sendOTP(phone);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, code } = req.body;
    const verificationCode = otp || code;

    if (!phone || !verificationCode) {
      return res.status(400).json({ message: 'Phone and OTP code are required' });
    }

    let normalizedPhone = phone.replace(/\s+/g, '');
    if (normalizedPhone.length === 10) normalizedPhone = `+91${normalizedPhone}`;

    const verificationCheck = await verifyOTP(normalizedPhone, verificationCode);

    if (verificationCheck.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ phone: normalizedPhone });
    let isNewUser = false;

    if (!user) {
      user = new User({ phone: normalizedPhone, isPhoneVerified: true });
      isNewUser = true;
    } else {
      user.isPhoneVerified = true;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Hash and save refresh token
    const salt = await bcrypt.genSalt(12);
    user.refreshToken = await bcrypt.hash(refreshToken, salt);
    await user.save();

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user,
      isNewUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { name, email, dateOfBirth, dob, gender } = req.body;
    const finalDOB = dateOfBirth || dob;

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name;
    if (email) user.email = email;
    if (finalDOB) user.dateOfBirth = finalDOB;
    if (gender) user.gender = gender;

    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });

    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) return res.status(401).json({ message: 'Invalid refresh token' });

    const user = await User.findById(decoded.id);
    if (!user || !user.refreshToken) return res.status(401).json({ message: 'User not found or logged out' });

    const isMatch = await bcrypt.compare(token, user.refreshToken);
    if (!isMatch) return res.status(401).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
