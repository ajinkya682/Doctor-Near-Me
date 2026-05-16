import mongoose from 'mongoose';

const ClinicOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  ownedClinics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
  }],
  role: {
    type: String,
    default: 'clinic_owner',
  },
  isApprovedByAdmin: {
    type: Boolean,
    default: false,
  },
  approvalDocuments: [{
    type: String, // URLs to documents
  }],
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountName: String,
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });

const ClinicOwner = mongoose.model('ClinicOwner', ClinicOwnerSchema);
export default ClinicOwner;
