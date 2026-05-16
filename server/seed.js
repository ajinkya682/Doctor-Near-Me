import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Clinic from './src/models/Clinic.js';
import Doctor from './src/models/Doctor.js';
import User from './src/models/User.js';
import Review from './src/models/Review.js';
import ClinicOwner from './src/models/ClinicOwner.js';
import Appointment from './src/models/Appointment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Clinic.deleteMany({});
    await Doctor.deleteMany({});
    await Review.deleteMany({});
    await ClinicOwner.deleteMany({});
    await User.deleteMany({});
    await Appointment.deleteMany({});

    // 0. Create a Demo Owner
    const owner = await ClinicOwner.create({
      name: 'Dr. Jane Smith',
      email: 'jane@clinic.com',
      phone: '+919999999999',
      password: 'password123',
    });

    // 1. Create a Demo Clinic
    const clinic = await Clinic.create({
      name: 'City Care Multi-Specialty Clinic',
      slug: 'city-care-clinic',
      ownerId: owner._id,
      address: 'Suite 402, Viman Nagar, Pune, MH 411014',
      location: { type: 'Point', coordinates: [73.9144, 18.5679] },
      description: 'City Care is a premier healthcare provider offering comprehensive medical services. Our state-of-the-art facility is equipped with the latest technology and staffed by top-tier specialists.',
      phone: '+91 98765 43210',
      email: 'contact@citycare.com',
      coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1631815541542-e8929e71ecba?auto=format&fit=crop&q=80&w=800'
      ],
      specialties: ['Cardiology', 'Dental', 'General', 'Dermatology'],
      amenities: ['Parking', 'AC', 'Wheelchair', 'Lab', 'Pharmacy'],
      rating: 4.7,
      totalReviews: 128,
      status: 'approved'
    });

    // 2. Create Doctors for this clinic
    const doc1 = await Doctor.create({
      name: 'Dr. Sarah Johnson',
      slug: 'sarah-johnson',
      phone: '+919876543211',
      specialization: 'Cardiology',
      experience: 12,
      consultationFee: 800,
      registrationNumber: 'REG123456',
      profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
      averageRating: 4.9,
      clinicId: clinic._id,
      availableSlotDuration: 30,
      workingDays: {
        monday: { open: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        tuesday: { open: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        wednesday: { open: true, startTime: '09:00', endTime: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      }
    });

    const doc2 = await Doctor.create({
      name: 'Dr. Amit Mehta',
      slug: 'amit-mehta',
      phone: '+919876543212',
      specialization: 'Dental',
      experience: 8,
      consultationFee: 500,
      registrationNumber: 'REG789012',
      profilePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
      averageRating: 4.8,
      clinicId: clinic._id,
      availableSlotDuration: 20,
      workingDays: {
        monday: { open: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
        thursday: { open: true, startTime: '10:00', endTime: '19:00', breakStart: '14:00', breakEnd: '15:00' },
      }
    });

    // Link doctors to clinic
    clinic.doctors = [doc1._id, doc2._id];
    await clinic.save();

    // 3. Create a Demo Patient
    const patient = await User.create({
      name: 'Rahul Verma',
      phone: '+919999999998',
      role: 'patient',
      location: { type: 'Point', coordinates: [73.9144, 18.5679] }
    });

    // 4. Create a Dummy Appointment for Review
    const appointment = await Appointment.create({
      bookingId: 'BK-12345',
      patientId: patient._id,
      doctorId: doc1._id,
      clinicId: clinic._id,
      appointmentDate: new Date(),
      timeSlot: '10:00 AM',
      consultationFee: 800,
      status: 'completed'
    });

    // 5. Create Reviews
    await Review.create([
      {
        patientId: patient._id,
        doctorId: doc1._id,
        clinicId: clinic._id,
        appointmentId: appointment._id,
        overallRating: 5,
        comment: 'Excellent service and very clean clinic. The staff was professional.',
        reply: 'Thank you Rahul! We strive to provide the best care.',
        repliedAt: new Date(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
