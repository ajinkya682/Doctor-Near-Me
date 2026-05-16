import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-refreshToken');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    // This will be handled by multer and cloudinary in the upload route, 
    // but we can have a specific one here if needed. 
    // For now, let's assume the frontend uploads first and then calls this with the URL.
    const { url } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { profilePhoto: url }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedClinics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedClinics');
    res.status(200).json(user.savedClinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user.savedClinics.includes(clinicId)) {
      user.savedClinics.push(clinicId);
      await user.save();
    }
    res.status(200).json({ success: true, savedClinics: user.savedClinics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsaveClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const user = await User.findById(req.user.id);
    user.savedClinics = user.savedClinics.filter(id => id.toString() !== clinicId);
    await user.save();
    res.status(200).json({ success: true, savedClinics: user.savedClinics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id, userType: 'patient' }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, userType: 'patient' }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
