import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    bookingChannel: {
      type: String,
      enum: ["app", "whatsapp"],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    consultationFee: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model("Appointment", appointmentSchema);

export default appointmentModel;
