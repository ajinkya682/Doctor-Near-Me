import mongoose from 'mongoose';

const ContactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    enum: ['Patient Support', 'Clinic Partner Inquiry', 'Press', 'Careers', 'Other'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded'],
    default: 'new',
  }
}, { timestamps: true });

const ContactSubmission = mongoose.model('ContactSubmission', ContactSubmissionSchema);
export default ContactSubmission;
