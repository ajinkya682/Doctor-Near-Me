import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
  },
  bloodGroup: {
    type: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'mr', 'gu'],
    default: 'en',
  },
  fcmToken: {
    type: String,
  },
  savedClinics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
  }],
  bookingIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  }],
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    default: 'patient',
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });

// Index for location search
UserSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', UserSchema);
export default User;
