import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import { generateTimeSlots } from "../utils/slot.util.js";
import { sendWhatsApp } from "../services/twilio.service.js";
import mongoose from "mongoose";

/**
 * Get available slots for a doctor on a specific date
 */
export const getAvailableSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query; // Format: YYYY-MM-DD

  if (!date) return res.status(400).json({ message: "Date is required" });

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Mocking working hours for now - in production, pull from doctor/clinic model
    const morningSlots = generateTimeSlots("09:00", "13:00", 20);
    const afternoonSlots = generateTimeSlots("14:00", "17:00", 20);
    const eveningSlots = generateTimeSlots("18:00", "21:00", 20);

    const allGeneratedSlots = [
      ...morningSlots,
      ...afternoonSlots,
      ...eveningSlots,
    ];

    // Find booked appointments
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Appointment.find({
      doctor: doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ["confirmed", "pending"] },
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);

    // Filter available slots
    const available = {
      morning: morningSlots.filter((s) => !bookedSlots.includes(s)),
      afternoon: afternoonSlots.filter((s) => !bookedSlots.includes(s)),
      evening: eveningSlots.filter((s) => !bookedSlots.includes(s)),
    };

    res.status(200).json({ doctorId, date, available });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Book an appointment
 * @route   POST /api/appointments
 * @access  Private
 */
export const bookAppointment = async (req, res) => {
  const { doctorId, clinicId, date, timeSlot, notes } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if slot is still available (atomic prevention)
    const existingBooking = await Appointment.findOne({
      doctor: doctorId,
      date: new Date(date),
      timeSlot,
      status: { $in: ["confirmed", "pending"] },
    }).session(session);

    if (existingBooking) {
      await session.abortTransaction();
      return res
        .status(409)
        .json({
          error: "SLOT_UNAVAILABLE",
          message: "This slot was just booked",
        });
    }

    const doctor = await Doctor.findById(doctorId).session(session);

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      clinic: clinicId,
      date: new Date(date),
      timeSlot,
      bookingChannel: "app",
      notes,
      consultationFee: doctor.consultationFee,
      status: "confirmed",
    });

    await appointment.save({ session });
    await session.commitTransaction();

    // Send WhatsApp confirmation
    const message = `Hello! Your appointment with ${doctor.name} on ${date} at ${timeSlot} is confirmed.`;
    await sendWhatsApp(req.user.phone, message);

    res
      .status(201)
      .json({ appointment, message: "Appointment booked successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

/**
 * @desc    Get user booking history
 * @route   GET /api/appointments/my
 * @access  Private
 */
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate("doctor", "name specialization profilePhoto")
      .populate("clinic", "name address")
      .sort({ date: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cancel appointment
 * @route   PATCH /api/appointments/:id/cancel
 * @access  Private
 */
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if cancellation is at least 2 hours before
    const appointmentTime = new Date(appointment.date);
    const now = new Date();
    const diffHours = (appointmentTime - now) / (1000 * 60 * 60);

    if (diffHours < 2) {
      return res
        .status(400)
        .json({ message: "Cannot cancel within 2 hours of appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
