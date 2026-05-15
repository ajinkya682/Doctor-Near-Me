import express from "express";
const router = express.Router();
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protect, upload.single("image"), uploadImage);

export default router;
