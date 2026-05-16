import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Clinic from '../models/Clinic.js';
import Doctor from '../models/Doctor.js';
import { v4 as uuidv4 } from 'uuid';

const generateBookingId = async () => {
  const year = new Date().getFullYear();
  const count = await Appointment.countDocuments({
    createdAt: { $gte: new Date(year, 0, 1) }
  });
  return `APT-${year}-${(count + 1).toString().padStart(5, '0')}`;
};

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, clinicId, appointmentDate, timeSlot, type, patientNotes, consultationFee } = req.body;
    
    const bookingId = await generateBookingId();
    
    const appointment = new Appointment({
      bookingId,
      patientId: req.user.id,
      doctorId,
      clinicId,
      appointmentDate,
      timeSlot,
      type,
      patientNotes,
      consultationFee,
      status: 'pending'
    });

    await appointment.save();

    // Add to user's booking list
    await User.findByIdAndUpdate(req.user.id, { $push: { bookingIds: appointment._id } });
    
    // Increment clinic's total bookings
    await Clinic.findByIdAndUpdate(clinicId, { $inc: { totalBookings: 1 } });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { status, timeframe } = req.query;
    const query = { patientId: req.user.id };

    if (status) query.status = status;
    
    const now = new Date();
    if (timeframe === 'upcoming') {
      query.appointmentDate = { $gte: now.setHours(0,0,0,0) };
    } else if (timeframe === 'past') {
      query.appointmentDate = { $lt: now.setHours(0,0,0,0) };
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name profilePhoto specialization')
      .populate('clinicId', 'name address')
      .sort({ appointmentDate: timeframe === 'upcoming' ? 1 : -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId')
      .populate('clinicId')
      .populate('patientId', 'name phone');
    
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledBy = 'patient';
    appointment.cancelledAt = new Date();

    await appointment.save();
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTimeSlot } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.appointmentDate = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.status = 'pending'; // Reset to pending if rescheduled? Or stay confirmed?

    await appointment.save();
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
