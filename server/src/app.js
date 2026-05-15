import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/config.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import clinicRoutes from "./routes/clinic.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Doctor Near Me API is running...");
});

export default app;
