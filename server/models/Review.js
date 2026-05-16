import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true,
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  doctorRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  waitTimeRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  facilityRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: String,
  reply: String,
  repliedAt: Date,
  isVisible: {
    type: Boolean,
    default: true,
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
