import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import Routes
import patientAuthRoutes from './routes/patientAuthRoutes.js';
import clinicAuthRoutes from './routes/clinicAuthRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth/patient', patientAuthRoutes);
app.use('/api/auth/clinic', clinicAuthRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Doctor Near Me API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Connect to Database
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected To Database');
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });
});
