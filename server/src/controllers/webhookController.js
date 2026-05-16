import WhatsappSession from '../models/WhatsappSession.js';
import Clinic from '../models/Clinic.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { sendWhatsAppMessage } from '../utils/whatsappUtils.js';
import { generateDoctorSlots } from '../utils/slotGenerator.js';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import mongoose from 'mongoose';

const languages = {
  '1': 'en',
  '2': 'hi',
  '3': 'mr',
  '4': 'gu'
};

const messages = {
  en: {
    welcome: "👋 Welcome to ClinicBook! Book doctor appointments in your area. Please choose your language:\n1. English\n2. हिंदी\n3. मराठी\n4. ગુજરાતી",
    location: "Great! Please share your current location 📍 so I can find clinics near you. Tap the attachment icon and choose Location.",
    noClinics: "Sorry, I couldn't find any clinics within 5km. Try sending another location.",
    selectClinic: "🏥 Clinics near you:\n{list}\nReply with a number 1 to 5.",
    selectDoctor: "👨‍⚕️ Doctors at {clinicName}:\n{list}\nReply with a number to select a doctor.",
    selectDate: "📅 Available dates for Dr. {doctorName}:\n{list}\nReply with a number.",
    selectSlot: "🕐 Available time slots:\n{list}\nReply with a number.",
    summary: "✅ Booking Summary:\nDoctor: Dr. {doctorName}\nClinic: {clinicName}\nDate: {date}\nTime: {time}\nFee: ₹{fee}\n\nReply YES to confirm or NO to cancel.",
    confirmed: "🎉 Appointment Confirmed!\nBooking ID: {bookingId}\nDr. {doctorName}\n{date} at {time}\n{clinicName}\n\nWe will remind you 1 hour before.",
    cancelled: "Booking cancelled. Type 'hi' to start again.",
    error: "Oops! Something went wrong. Type 'hi' to start over."
  }
  // Add other languages as needed...
};

export const handleWhatsAppWebhook = async (req, res) => {
  const { From, Body, Latitude, Longitude } = req.body;
  const phone = From.replace('whatsapp:', '');

  try {
    let session = await WhatsappSession.findOne({ phone });

    if (!session || Body.toLowerCase() === 'hi' || Body.toLowerCase() === 'hello') {
      if (session) await WhatsappSession.deleteOne({ phone });
      
      session = new WhatsappSession({ phone, state: 'AWAITING_LANGUAGE' });
      await session.save();
      
      await sendWhatsAppMessage(phone, messages.en.welcome);
      return res.status(200).send('OK');
    }

    const currentState = session.state;
    const lang = session.data.language || 'en';
    const msg = messages[lang] || messages.en;

    // Handle 'back' command
    if (Body.toLowerCase() === 'back') {
      // Implement back logic if needed, for now just simple state machine
    }

    switch (currentState) {
      case 'AWAITING_LANGUAGE':
        if (languages[Body]) {
          session.data.language = languages[Body];
          session.state = 'AWAITING_LOCATION';
          await session.save();
          await sendWhatsAppMessage(phone, messages[languages[Body]].location);
        } else {
          await sendWhatsAppMessage(phone, "Please select 1, 2, 3, or 4.");
        }
        break;

      case 'AWAITING_LOCATION':
        if (Latitude && Longitude) {
          const clinics = await Clinic.find({
            location: {
              $near: {
                $geometry: { type: 'Point', coordinates: [parseFloat(Longitude), parseFloat(Latitude)] },
                $maxDistance: 5000
              }
            },
            isActive: true
          }).limit(5);

          if (clinics.length === 0) {
            await sendWhatsAppMessage(phone, msg.noClinics);
          } else {
            session.data.nearbyClinics = clinics.map(c => c._id);
            session.data.latitude = Latitude;
            session.data.longitude = Longitude;
            session.state = 'SELECTING_CLINIC';
            await session.save();

            const clinicList = clinics.map((c, i) => `${i + 1}. ${c.name} - ${c.address.city}`).join('\n');
            await sendWhatsAppMessage(phone, msg.selectClinic.replace('{list}', clinicList));
          }
        } else {
          await sendWhatsAppMessage(phone, "Please share your location using the WhatsApp attachment feature.");
        }
        break;

      case 'SELECTING_CLINIC':
        const clinicIndex = parseInt(Body) - 1;
        if (session.data.nearbyClinics[clinicIndex]) {
          const clinicId = session.data.nearbyClinics[clinicIndex];
          const clinic = await Clinic.findById(clinicId);
          const doctors = await Doctor.find({ clinicId, isActive: true });

          session.data.selectedClinicId = clinicId;
          session.data.doctorsInClinic = doctors.map(d => d._id);
          session.state = 'SELECTING_DOCTOR';
          await session.save();

          const doctorList = doctors.map((d, i) => `${i + 1}. Dr. ${d.name} - ${d.specialization} - ₹${d.consultationFee}`).join('\n');
          await sendWhatsAppMessage(phone, msg.selectDoctor.replace('{clinicName}', clinic.name).replace('{list}', doctorList));
        } else {
          await sendWhatsAppMessage(phone, "Invalid selection. Please choose 1 to 5.");
        }
        break;

      case 'SELECTING_DOCTOR':
        const docIndex = parseInt(Body) - 1;
        if (session.data.doctorsInClinic[docIndex]) {
          const doctorId = session.data.doctorsInClinic[docIndex];
          const doctor = await Doctor.findById(doctorId);

          // Generate next 7 available dates
          const dates = [];
          let d = new Date();
          while (dates.length < 7) {
            const dayName = format(d, 'EEEE').toLowerCase();
            if (doctor.workingDays[dayName]?.open) {
              dates.push(new Date(d));
            }
            d = addDays(d, 1);
          }

          session.data.selectedDoctorId = doctorId;
          session.data.availableDates = dates;
          session.state = 'SELECTING_DATE';
          await session.save();

          const dateList = dates.map((date, i) => `${i + 1}. ${format(date, 'EEEE, dd MMM')}`).join('\n');
          await sendWhatsAppMessage(phone, msg.selectDate.replace('{doctorName}', doctor.name).replace('{list}', dateList));
        } else {
          await sendWhatsAppMessage(phone, "Invalid selection.");
        }
        break;

      case 'SELECTING_DATE':
        const dateIndex = parseInt(Body) - 1;
        if (session.data.availableDates[dateIndex]) {
          const selectedDate = new Date(session.data.availableDates[dateIndex]);
          const doctor = await Doctor.findById(session.data.selectedDoctorId);

          const bookedAppointments = await Appointment.find({
            doctorId: doctor._id,
            appointmentDate: { $gte: startOfDay(selectedDate), $lte: endOfDay(selectedDate) },
            status: { $ne: 'cancelled' }
          });
          const bookedSlots = bookedAppointments.map(a => a.timeSlot);

          const allSlots = generateDoctorSlots(doctor, selectedDate, bookedSlots);
          const flatSlots = [...allSlots.morning, ...allSlots.afternoon, ...allSlots.evening].slice(0, 10);

          if (flatSlots.length === 0) {
            await sendWhatsAppMessage(phone, "No slots available on this day. Reply 'back' to choose another date.");
          } else {
            session.data.selectedDate = selectedDate;
            session.data.availableSlots = flatSlots;
            session.state = 'SELECTING_SLOT';
            await session.save();

            const slotList = flatSlots.map((s, i) => `${i + 1}. ${s}`).join('\n');
            await sendWhatsAppMessage(phone, msg.selectSlot.replace('{list}', slotList));
          }
        }
        break;

      case 'SELECTING_SLOT':
        const slotIdx = parseInt(Body) - 1;
        if (session.data.availableSlots[slotIdx]) {
          const slot = session.data.availableSlots[slotIdx];
          const doctor = await Doctor.findById(session.data.selectedDoctorId);
          const clinic = await Clinic.findById(session.data.selectedClinicId);

          session.data.selectedSlot = slot;
          session.state = 'AWAITING_CONFIRMATION';
          await session.save();

          const summary = msg.summary
            .replace('{doctorName}', doctor.name)
            .replace('{clinicName}', clinic.name)
            .replace('{date}', format(new Date(session.data.selectedDate), 'EEEE, dd MMM yyyy'))
            .replace('{time}', slot)
            .replace('{fee}', doctor.consultationFee);
          
          await sendWhatsAppMessage(phone, summary);
        }
        break;

      case 'AWAITING_CONFIRMATION':
        if (Body.toUpperCase() === 'YES') {
          // Create Appointment (Simulate the logic from Part 7)
          const doctor = await Doctor.findById(session.data.selectedDoctorId);
          const clinic = await Clinic.findById(session.data.selectedClinicId);
          
          // Find or create user by phone
          let user = await User.findOne({ phone });
          if (!user) {
            user = new User({ phone, name: 'WhatsApp User' });
            await user.save();
          }

          const appointment = new Appointment({
            bookingId: `APT-WA-${Date.now().toString().slice(-5)}`,
            patientId: user._id,
            doctorId: doctor._id,
            clinicId: clinic._id,
            appointmentDate: session.data.selectedDate,
            timeSlot: session.data.selectedSlot,
            consultationFee: doctor.consultationFee,
            status: 'pending'
          });
          await appointment.save();

          await sendWhatsAppMessage(phone, msg.confirmed
            .replace('{bookingId}', appointment.bookingId)
            .replace('{doctorName}', doctor.name)
            .replace('{date}', format(new Date(appointment.appointmentDate), 'dd MMM yyyy'))
            .replace('{time}', appointment.timeSlot)
            .replace('{clinicName}', clinic.name)
          );

          await WhatsappSession.deleteOne({ phone });
        } else {
          await sendWhatsAppMessage(phone, msg.cancelled);
          await WhatsappSession.deleteOne({ phone });
        }
        break;

      default:
        await sendWhatsAppMessage(phone, msg.error);
        await WhatsappSession.deleteOne({ phone });
    }

    session.lastActivityAt = new Date();
    await session.save();
    res.status(200).send('OK');

  } catch (error) {
    console.error('WhatsApp Bot Error:', error);
    res.status(200).send('OK'); // Always send 200 to Twilio
  }
};
