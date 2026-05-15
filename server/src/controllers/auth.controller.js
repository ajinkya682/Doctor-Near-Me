import User from "../models/User.js";
import { sendOTP, checkOTP } from "../services/twilio.service.js";
import {
  generateToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

/**
 * @desc    Request OTP
 * @route   POST /api/auth/request-otp
 * @access  Public
 */
export const requestOTP = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    await sendOTP(phone);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Verify OTP and Login/Register
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: "Phone and code are required" });
  }

  try {
    const isApproved = await checkOTP(phone, code);

    if (!isApproved) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({
        phone,
        isPhoneVerified: true,
      });
    } else {
      user.isPhoneVerified = true;
      await user.save();
    }

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      _id: user._id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Refresh Token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  const cookies = req.headers.cookie;
  if (!cookies) return res.status(401).json({ message: "No refresh token" });

  const refreshTokenValue = cookies.split("refreshToken=")[1]?.split(";")[0];
  if (!refreshTokenValue)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshTokenValue, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateToken(decoded.id);
    res.json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

/**
 * @desc    Logout
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};
