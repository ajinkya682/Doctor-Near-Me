import WhatsappSession from "../models/WhatsappSession.js";
import Clinic from "../models/Clinic.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendWhatsApp, sendWhatsAppList, sendWhatsAppButtons } from "./twilio.service.js";
import { generateTimeSlots } from "../utils/slot.util.js";
import mongoose from "mongoose";

const botMessages = {
  en: {
    welcome: "Welcome to Doctor Near Me! 🏥",
    selectLanguage: "Please select your preferred language:",
    askLocation: "Please share your current location using WhatsApp's location sharing feature. 📍",
    searching: "Searching for clinics near you...",
    noClinics: "Sorry, I couldn't find any clinics within 5km of your location.",
    foundClinics: "Here are the top 5 clinics near you. Please select one:",
    selectDoctor: "Please select a doctor at this clinic:",
    selectDate: "Select a date for your appointment:",
    selectSlot: "Select an available time slot:",
    confirmBooking: (details) => `Please confirm your booking:\n\n👨‍⚕️ Doctor: ${details.doctor}\n🏥 Clinic: ${details.clinic}\n📅 Date: ${details.date}\n⏰ Time: ${details.slot}\n💰 Fee: ₹${details.fee}\n\nConfirm?`,
    bookingSuccess: "Your appointment is confirmed! ✅ See you soon.",
    bookingFailed: "Sorry, that slot was just taken. Please try again.",
    invalidInput: "I didn't understand that. Please try again or use the buttons/list provided."
  }
  // Hindi, Marathi, Gujarati can be added here
};

export const handleBotFlow = async (phone, body, latitude, longitude) => {
  let session = await WhatsappSession.findOne({ phone });

  // Expire session if older than 10 mins (600000ms)
  if (session && Date.now() - session.lastActive > 600000) {
    session.state = "GREETING";
  }

  if (!session) {
    session = await WhatsappSession.create({ phone, state: "GREETING" });
  }

  const lang = session.language || "en";
  const msg = botMessages[lang];

  try {
    switch (session.state) {
      case "GREETING":
        await sendWhatsApp(phone, msg.welcome);
        await sendWhatsAppList(phone, msg.selectLanguage, "Languages", [
          { title: "English", id: "en" },
          { title: "Hindi", id: "hi" },
          { title: "Marathi", id: "mr" },
          { title: "Gujarati", id: "gu" }
        ]);
        session.state = "AWAITING_LANGUAGE";
        break;

      case "AWAITING_LANGUAGE":
        const selectedLang = body.toLowerCase().substring(0, 2); // Simplified
        if (['en', 'hi', 'mr', 'gu'].includes(selectedLang)) {
          session.language = selectedLang;
          session.state = "AWAITING_LOCATION";
          await sendWhatsApp(phone, botMessages[selectedLang].askLocation);
        } else {
          await sendWhatsApp(phone, msg.selectLanguage);
        }
        break;

      case "AWAITING_LOCATION":
        if (latitude && longitude) {
          session.lastLocation = { type: "Point", coordinates: [longitude, latitude] };
          await sendWhatsApp(phone, msg.searching);
          
          // Call nearby clinics logic (inline for bot)
          const clinics = await Clinic.aggregate([
            {
              $geoNear: {
                near: { type: "Point", coordinates: [longitude, latitude] },
                distanceField: "distance",
                maxDistance: 5000, // 5km
                spherical: true
              }
            },
            { $limit: 5 }
          ]);

          if (clinics.length === 0) {
            await sendWhatsApp(phone, msg.noClinics);
            session.state = "AWAITING_LOCATION";
          } else {
            const clinicOptions = clinics.map(c => ({ title: c.name, id: c._id.toString() }));
            await sendWhatsAppList(phone, msg.foundClinics, "Clinics", clinicOptions);
            session.state = "SHOWING_RESULTS";
          }
        } else {
          await sendWhatsApp(phone, msg.askLocation);
        }
        break;

      case "SHOWING_RESULTS":
        // Find clinic by name or ID (simplified)
        const clinic = await Clinic.findOne({ name: body }); 
        if (clinic) {
          session.selectedClinic = clinic._id;
          const doctors = await Doctor.find({ clinic: clinic._id });
          const doctorOptions = doctors.map(d => ({ title: d.name, id: d._id.toString() }));
          await sendWhatsAppList(phone, msg.selectDoctor, "Doctors", doctorOptions);
          session.state = "SELECTING_DOCTOR";
        } else {
          await sendWhatsApp(phone, msg.invalidInput);
        }
        break;

      case "SELECTING_DOCTOR":
        const doctor = await Doctor.findOne({ name: body });
        if (doctor) {
          session.selectedDoctor = doctor._id;
          // Generate next 7 dates
          const dates = [];
          for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
          }
          await sendWhatsAppButtons(phone, msg.selectDate, dates.slice(0, 3)); // Twilio Button limit 3
          // For 7 dates, we'd use a List, but keeping it simple with 3 for now or multiple messages
          session.state = "SELECTING_DATE";
        }
        break;

      case "SELECTING_DATE":
        session.selectedDate = body; // Assume valid date from button
        // Get slots
        const slots = generateTimeSlots("09:00", "13:00", 20); // Simplified
        await sendWhatsAppButtons(phone, msg.selectSlot, slots.slice(0, 3));
        session.state = "SELECTING_SLOT";
        break;

      case "SELECTING_SLOT":
        session.selectedSlot = body;
        const selDoctor = await Doctor.findById(session.selectedDoctor);
        const selClinic = await Clinic.findById(session.selectedClinic);
        
        const summary = msg.confirmBooking({
          doctor: selDoctor.name,
          clinic: selClinic.name,
          date: session.selectedDate,
          slot: body,
          fee: selDoctor.consultationFee
        });
        
        await sendWhatsAppButtons(phone, summary, ["Yes", "No"]);
        session.state = "AWAITING_CONFIRMATION";
        break;

      case "AWAITING_CONFIRMATION":
        if (body.toLowerCase() === "yes") {
          // Find user by phone
          let user = await User.findOne({ phone });
          if (!user) user = await User.create({ phone, name: "WhatsApp User" });

          const newAppointment = new Appointment({
            patient: user._id,
            doctor: session.selectedDoctor,
            clinic: session.selectedClinic,
            date: new Date(session.selectedDate),
            timeSlot: session.selectedSlot,
            bookingChannel: "whatsapp",
            consultationFee: (await Doctor.findById(session.selectedDoctor)).consultationFee,
            status: "confirmed"
          });

          await newAppointment.save();
          await sendWhatsApp(phone, msg.bookingSuccess);
          session.state = "CONFIRMED";
        } else {
          await sendWhatsApp(phone, "Booking cancelled. Send 'Hi' to start again.");
          session.state = "GREETING";
        }
        break;

      default:
        session.state = "GREETING";
        await handleBotFlow(phone, body); // Recursion to restart
        break;
    }

    session.lastActive = Date.now();
    await session.save();
  } catch (error) {
    console.error(`Bot Flow Error: ${error.message}`);
    await sendWhatsApp(phone, "Sorry, something went wrong. Please try again later.");
  }
};
