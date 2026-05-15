import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.middleware.js";
import {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/appointment.controller.js";

router.get("/slots/:doctorId", getAvailableSlots);
router.get("/my", protect, getMyAppointments);
router.post("/", protect, bookAppointment);
router.patch("/:id/cancel", protect, cancelAppointment);

export default router;
