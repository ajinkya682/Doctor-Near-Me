import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Clinic from '../models/Clinic.js';
import Doctor from '../models/Doctor.js';
import Notification from '../models/Notification.js';
import { startOfDay, endOfDay } from 'date-fns';

const generateBookingId = async (session) => {
  const year = new Date().getFullYear();
  const count = await Appointment.countDocuments({
    createdAt: { $gte: new Date(year, 0, 1) }
  }).session(session);
  return `APT-${year}-${(count + 1).toString().padStart(5, '0')}`;
};

export const createAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { doctorId, clinicId, appointmentDate, timeSlot, type, patientNotes, consultationFee } = req.body;
    const queryDate = new Date(appointmentDate);

    // 1. Re-run slot availability check inside transaction
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: startOfDay(queryDate),
        $lte: endOfDay(queryDate)
      },
      timeSlot,
      status: { $ne: 'cancelled' }
    }).session(session);

    if (existingAppointment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ message: 'This slot was just taken, please choose another.' });
    }

    // 2. Generate Booking ID
    const bookingId = await generateBookingId(session);

    // 3. Create Appointment
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

    await appointment.save({ session });

    // 4. Update related documents
    await User.findByIdAndUpdate(req.user.id, { $push: { bookingIds: appointment._id } }, { session });
    await Clinic.findByIdAndUpdate(clinicId, { $inc: { totalBookings: 1 } }, { session });

    // Commit Transaction
    await session.commitTransaction();
    session.endSession();

    // 5. Post-Commit Async Tasks (Do not make user wait)
    handlePostBookingTasks(appointment, req.user.id);

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

const handlePostBookingTasks = async (appointment, patientId) => {
  try {
    const doctor = await Doctor.findById(appointment.doctorId);
    const clinic = await Clinic.findById(appointment.clinicId);
    const user = await User.findById(patientId);

    // Create Notification for Patient
    await Notification.create({
      userId: patientId,
      userType: 'patient',
      title: 'Booking Pending',
      message: `Your booking ${appointment.bookingId} with Dr. ${doctor.name} is pending confirmation.`,
      type: 'appointment'
    });

    // Create Notification for Clinic Owner
    await Notification.create({
      userId: clinic.ownerId,
      userType: 'owner',
      title: 'New Booking Request',
      message: `New appointment request ${appointment.bookingId} for Dr. ${doctor.name}.`,
      type: 'appointment'
    });

    // Placeholder for WhatsApp/SMS/Cron
    console.log(`Async Tasks: Sending notifications for booking ${appointment.bookingId}`);
    // TODO: Call Twilio for WhatsApp/SMS
    // TODO: Schedule node-cron reminder

  } catch (err) {
    console.error('Error in post-booking tasks:', err);
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { status, timeframe } = req.query;
    const query = { patientId: req.user.id };

    if (status) query.status = status;
    
    const now = new Date();
    if (timeframe === 'upcoming') {
      query.appointmentDate = { $gte: startOfDay(now) };
    } else if (timeframe === 'past') {
      query.appointmentDate = { $lt: startOfDay(now) };
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
    appointment.status = 'pending';

    await appointment.save();
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
