import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "hi", "mr", "gu"],
      default: "en",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    role: {
      type: String,
      enum: ["patient", "admin"],
      default: "patient",
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for location
userSchema.index({ location: "2dsphere" });

const userModel = mongoose.model("User", userSchema);

export default userModel;
