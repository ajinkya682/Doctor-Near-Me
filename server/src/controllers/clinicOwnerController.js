import Clinic from '../models/Clinic.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';
import ClinicOwner from '../models/ClinicOwner.js';
import slugify from 'slugify';

export const createClinic = async (req, res) => {
  try {
    const { name, description, address, location, specializations } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const clinic = new Clinic({
      name,
      slug,
      ownerId: req.user.id,
      description,
      address,
      location,
      specializations,
      isActive: true
    });

    await clinic.save();
    
    // Add to owner's list
    await ClinicOwner.findByIdAndUpdate(req.user.id, { $push: { ownedClinics: clinic._id } });

    res.status(201).json({ success: true, clinic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({ ownerId: req.user.id });
    res.status(200).json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    res.status(200).json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDoctorToClinic = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const doctorData = { ...req.body, clinicId };
    
    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({ success: true, doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Doctor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOwnerAppointments = async (req, res) => {
  try {
    const { clinicId, date, status } = req.query;
    
    let clinicIds = [];
    if (clinicId) {
      clinicIds = [clinicId];
    } else {
      const clinics = await Clinic.find({ ownerId: req.user.id });
      clinicIds = clinics.map(c => c._id);
    }

    const query = { clinicId: { $in: clinicIds } };
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      query.appointmentDate = {
        $gte: new Date(d.setHours(0,0,0,0)),
        $lte: new Date(d.setHours(23,59,59,999))
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name')
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id, status } = req.params; // status passed in URL for confirm/cancel/complete
    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const clinics = await Clinic.find({ ownerId: req.user.id });
    const clinicIds = clinics.map(c => c._id);

    const totalBookings = await Appointment.countDocuments({ clinicId: { $in: clinicIds } });
    const completedBookings = await Appointment.countDocuments({ clinicId: { $in: clinicIds }, status: 'completed' });
    const totalRevenue = await Appointment.aggregate([
      { $match: { clinicId: { $in: clinicIds }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$consultationFee' } } }
    ]);

    res.status(200).json({
      totalBookings,
      completedBookings,
      revenue: totalRevenue[0]?.total || 0,
      clinicCount: clinics.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    await Review.findByIdAndUpdate(id, { reply, repliedAt: new Date() });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
