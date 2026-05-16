import mongoose from 'mongoose';

const DayScheduleSchema = new mongoose.Schema({
  open: { type: Boolean, default: false },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '21:00' },
  breakStart: String,
  breakEnd: String,
}, { _id: false });

const ClinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClinicOwner',
    required: true,
  },
  description: String,
  specializations: [{
    type: String,
  }],
  photos: [{
    type: String, // Cloudinary URLs
  }],
  coverPhoto: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  phone: String,
  alternatePhone: String,
  email: String,
  website: String,
  openingHours: {
    monday: DayScheduleSchema,
    tuesday: DayScheduleSchema,
    wednesday: DayScheduleSchema,
    thursday: DayScheduleSchema,
    friday: DayScheduleSchema,
    saturday: DayScheduleSchema,
    sunday: DayScheduleSchema,
  },
  holidays: [Date],
  amenities: [String],
  paymentMethods: [String],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  isVerifiedByAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Indexes for performance and geolocation
ClinicSchema.index({ location: '2dsphere' });
ClinicSchema.index({ specializations: 1 });
ClinicSchema.index({ averageRating: -1 });

const Clinic = mongoose.model('Clinic', ClinicSchema);
export default Clinic;
