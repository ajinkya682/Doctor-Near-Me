import mongoose from 'mongoose';

const DayScheduleSchema = new mongoose.Schema({
  open: { type: Boolean, default: false },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '21:00' },
  breakStart: String,
  breakEnd: String,
}, { _id: false });

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  bio: String,
  specialization: {
    type: String,
    required: true,
  },
  additionalSpecializations: [String],
  qualifications: [{
    degree: String,
    institute: String,
    year: Number,
  }],
  experience: {
    type: Number,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  followUpFee: Number,
  availableSlotDuration: {
    type: Number,
    default: 20, // minutes
  },
  workingDays: {
    monday: DayScheduleSchema,
    tuesday: DayScheduleSchema,
    wednesday: DayScheduleSchema,
    thursday: DayScheduleSchema,
    friday: DayScheduleSchema,
    saturday: DayScheduleSchema,
    sunday: DayScheduleSchema,
  },
  languages: [String],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAvailableToday: {
    type: Boolean,
    default: true,
  },
  leavesDates: [Date],
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;
