import Doctor from '../models/Doctor.js';
import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import { generateDoctorSlots } from '../utils/slotGenerator.js';
import { startOfDay, endOfDay } from 'date-fns';

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('clinicId');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // format: YYYY-MM-DD

    if (!date) return res.status(400).json({ message: 'Date is required' });

    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const queryDate = new Date(date);
    
    // Find all confirmed and pending appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      appointmentDate: {
        $gte: startOfDay(queryDate),
        $lte: endOfDay(queryDate)
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);

    // Generate slots using utility
    const availableSlots = generateDoctorSlots(doctor, queryDate, bookedSlots);

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctorId: req.params.id, isVisible: true })
      .populate('patientId', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
