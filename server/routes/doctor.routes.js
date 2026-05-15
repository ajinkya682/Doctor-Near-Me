import express from "express";
const router = express.Router();
import { getDoctorProfile } from "../controllers/doctor.controller.js";

router.get("/:id", getDoctorProfile);

export default router;
