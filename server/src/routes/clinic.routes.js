import express from "express";
const router = express.Router();
import {
  getNearbyClinics,
  getClinicDetails,
} from "../controllers/clinic.controller.js";

router.get("/nearby", getNearbyClinics);
router.get("/:id", getClinicDetails);

export default router;
