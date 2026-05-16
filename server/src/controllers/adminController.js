import ClinicOwner from '../models/ClinicOwner.js';
import Clinic from '../models/Clinic.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { sendEmail } from '../utils/emailUtils.js';

export const getPendingOwners = async (req, res) => {
  try {
    const owners = await ClinicOwner.find({ isApprovedByAdmin: false, isEmailVerified: true });
    res.status(200).json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveClinicOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await ClinicOwner.findById(id);

    if (!owner) return res.status(404).json({ message: 'Clinic owner not found' });

    owner.isApprovedByAdmin = true;
    await owner.save();

    await sendEmail({
      to: owner.email,
      subject: 'Account Approved - Doctor Near Me',
      html: `<h1>Congratulations ${owner.name}!</h1><p>Your clinic owner account has been approved. You can now log in.</p>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectClinicOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const owner = await ClinicOwner.findById(id);

    if (!owner) return res.status(404).json({ message: 'Clinic owner not found' });

    await sendEmail({
      to: owner.email,
      subject: 'Account Application Update',
      html: `<p>Sorry ${owner.name}, your account was not approved.</p><p>Reason: ${reason}</p>`
    });

    await ClinicOwner.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Owner rejected and deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find().populate('ownerId', 'name email');
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyClinic = async (req, res) => {
  try {
    await Clinic.findByIdAndUpdate(req.params.id, { isVerifiedByAdmin: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const featureClinic = async (req, res) => {
  try {
    const { isFeatured } = req.body;
    await Clinic.findByIdAndUpdate(req.params.id, { isFeatured });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-refreshToken');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClinics = await Clinic.countDocuments();
    const totalOwners = await ClinicOwner.countDocuments();
    
    res.status(200).json({ totalUsers, totalClinics, totalOwners });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('patientId', 'name').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
