import ClinicOwner from '../models/ClinicOwner.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/emailUtils.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/tokenUtils.js';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and contain a number' });
    }

    const existingOwner = await ClinicOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const owner = new ClinicOwner({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await owner.save();

    // Create verification token
    const verificationToken = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    const verificationLink = `${process.env.FRONTEND_URL}/clinic/verify-email/${verificationToken}`;

    // Send email
    await sendEmail({
      to: email,
      subject: 'Verify Your Clinic Owner Account',
      html: `<h1>Welcome to Doctor Near Me</h1><p>Please click the link below to verify your email:</p><a href="${verificationLink}">Verify Email</a>`
    });

    res.status(201).json({ success: true, message: 'Registration successful. Please check your email for verification.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(400).json({ message: 'Invalid or expired token' });

    const owner = await ClinicOwner.findById(decoded.id);
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    owner.isEmailVerified = true;
    await owner.save();

    // The guide says redirect to login page with a message
    res.redirect(`${process.env.FRONTEND_URL}/clinic/login?verified=true`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await ClinicOwner.findOne({ email });

    if (!owner || !(await bcrypt.compare(password, owner.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!owner.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    if (!owner.isApprovedByAdmin) {
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }

    const accessToken = generateAccessToken(owner);
    const refreshToken = generateRefreshToken(owner);

    // Hash and save refresh token
    const salt = await bcrypt.genSalt(12);
    owner.refreshToken = await bcrypt.hash(refreshToken, salt);
    await owner.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      accessToken,
      owner
    });
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

    const owner = await ClinicOwner.findById(decoded.id);
    if (!owner || !owner.refreshToken) return res.status(401).json({ message: 'Owner not found or logged out' });

    const isMatch = await bcrypt.compare(token, owner.refreshToken);
    if (!isMatch) return res.status(401).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(owner);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const owner = await ClinicOwner.findById(req.user.id);
    if (owner) {
      owner.refreshToken = null;
      await owner.save();
    }
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
