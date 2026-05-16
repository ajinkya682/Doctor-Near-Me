import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userType: {
    type: String,
    enum: ['patient', 'clinic_owner', 'admin'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'bookingConfirmed',
      'bookingCancelled',
      'reminder',
      'newReview',
      'newBooking',
      'accountApproved',
      'accountRejected',
      'paymentReceived'
    ],
    required: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
