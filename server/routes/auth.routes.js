import express from "express";
const router = express.Router();
import {
  requestOTP,
  verifyOTP,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
