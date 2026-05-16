import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  timeSlotEnd: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checkedIn', 'completed', 'cancelled', 'noShow'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['firstVisit', 'followUp'],
    default: 'firstVisit',
  },
  channel: {
    type: String,
    enum: ['app', 'whatsapp', 'walkin'],
    default: 'app',
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid',
  },
  paymentMethod: String,
  patientNotes: String,
  clinicNotes: String,
  prescriptionUrl: String,
  reminderSent: {
    type: Boolean,
    default: false,
  },
  isRated: {
    type: Boolean,
    default: false,
  },
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['patient', 'clinic'],
  },
  cancelledAt: Date,
}, { timestamps: true });

// Compound index for fast slot lookup
AppointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;
