import mongoose from 'mongoose';

const WhatsappSessionSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
    default: 'IDLE',
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'mr', 'gu'],
  },
  location: {
    lat: Number,
    lng: Number,
  },
  selectedClinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
  },
  selectedDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  selectedDate: Date,
  selectedSlot: String,
  tentativeBookingData: {
    type: Object,
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const WhatsappSession = mongoose.model('WhatsappSession', WhatsappSessionSchema);
export default WhatsappSession;
