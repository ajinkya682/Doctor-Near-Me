const mongoose = require('mongoose');

const whatsappSessionSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  state: {
    type: String,
    enum: [
      'GREETING',
      'LANGUAGE_SELECTED',
      'LOCATION_RECEIVED',
      'SHOWING_RESULTS',
      'BOOKING_SLOT',
      'CONFIRMED',
      'AWAITING_LANGUAGE',
      'AWAITING_LOCATION',
      'SELECTING_DOCTOR',
      'SELECTING_DATE',
      'SELECTING_SLOT',
      'AWAITING_CONFIRMATION'
    ],
    default: 'GREETING'
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'mr', 'gu'],
    default: 'en'
  },
  lastLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  selectedClinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  },
  selectedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index to expire sessions after some time (optional, but requested in guide)
// whatsappSessionSchema.index({ lastActive: 1 }, { expireAfterSeconds: 600 }); // 10 mins

module.exports = mongoose.model('WhatsappSession', whatsappSessionSchema);
