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
    welcome: "Welcome to Doctor Near Me.",
    selectLanguage: "Please select your preferred language:",
    askLocation: "Please share your current location using WhatsApp location sharing feature.",
    searching: "Searching for clinics near you...",
    noClinics: "Sorry, no clinics were found within 5 km of your location.",
    foundClinics: "Here are the top clinics near you. Please select one:",
    selectDoctor: "Please select a doctor from this clinic:",
    selectDate: "Please select a date for your appointment:",
    selectSlot: "Please select an available time slot:",
    confirmBooking: (details) =>
      `Please confirm your booking:\n\nDoctor: ${details.doctor}\nClinic: ${details.clinic}\nDate: ${details.date}\nTime: ${details.slot}\nFee: ₹${details.fee}\n\nDo you want to confirm this appointment?`,
    bookingSuccess: "Your appointment has been confirmed successfully.",
    bookingFailed: "Sorry, this slot was just booked. Please try another time.",
    invalidInput: "I didn't understand that. Please use the provided options or try again."
  },

  hi: {
    welcome: "Doctor Near Me में आपका स्वागत है।",
    selectLanguage: "कृपया अपनी पसंदीदा भाषा चुनें:",
    askLocation: "कृपया WhatsApp लोकेशन शेयरिंग के माध्यम से अपना वर्तमान स्थान भेजें।",
    searching: "आपके नज़दीकी क्लिनिक खोजे जा रहे हैं...",
    noClinics: "क्षमा करें, आपके स्थान के 5 किमी के अंदर कोई क्लिनिक नहीं मिला।",
    foundClinics: "आपके पास के प्रमुख क्लिनिक यहां हैं। कृपया एक चुनें:",
    selectDoctor: "कृपया इस क्लिनिक से डॉक्टर चुनें:",
    selectDate: "अपॉइंटमेंट के लिए तारीख चुनें:",
    selectSlot: "उपलब्ध समय स्लॉट चुनें:",
    confirmBooking: (details) =>
      `कृपया अपनी बुकिंग की पुष्टि करें:\n\nडॉक्टर: ${details.doctor}\nक्लिनिक: ${details.clinic}\nतारीख: ${details.date}\nसमय: ${details.slot}\nफीस: ₹${details.fee}\n\nक्या आप इस अपॉइंटमेंट की पुष्टि करना चाहते हैं?`,
    bookingSuccess: "आपकी अपॉइंटमेंट सफलतापूर्वक कन्फर्म हो गई है।",
    bookingFailed: "क्षमा करें, यह स्लॉट अभी-अभी बुक हो गया है। कृपया दूसरा समय चुनें।",
    invalidInput: "मैं समझ नहीं पाया। कृपया दिए गए विकल्पों का उपयोग करें या फिर से प्रयास करें।"
  },

  mr: {
    welcome: "Doctor Near Me मध्ये आपले स्वागत आहे.",
    selectLanguage: "कृपया तुमची आवडती भाषा निवडा:",
    askLocation: "कृपया WhatsApp लोकेशन शेअर करून तुमचे वर्तमान स्थान पाठवा.",
    searching: "तुमच्या जवळील क्लिनिक शोधले जात आहेत...",
    noClinics: "माफ करा, तुमच्या स्थानापासून 5 किमी परिसरात कोणतेही क्लिनिक सापडले नाही.",
    foundClinics: "तुमच्या जवळील प्रमुख क्लिनिक येथे आहेत. कृपया एक निवडा:",
    selectDoctor: "कृपया या क्लिनिकमधून डॉक्टर निवडा:",
    selectDate: "अपॉइंटमेंटसाठी तारीख निवडा:",
    selectSlot: "उपलब्ध वेळ स्लॉट निवडा:",
    confirmBooking: (details) =>
      `कृपया तुमची बुकिंग निश्चित करा:\n\nडॉक्टर: ${details.doctor}\nक्लिनिक: ${details.clinic}\nतारीख: ${details.date}\nवेळ: ${details.slot}\nफीस: ₹${details.fee}\n\nतुम्ही ही अपॉइंटमेंट निश्चित करू इच्छिता का?`,
    bookingSuccess: "तुमची अपॉइंटमेंट यशस्वीरित्या निश्चित झाली आहे.",
    bookingFailed: "माफ करा, हा स्लॉट नुकताच बुक झाला आहे. कृपया दुसरा वेळ निवडा.",
    invalidInput: "मला समजले नाही. कृपया दिलेले पर्याय वापरा किंवा पुन्हा प्रयत्न करा."
  },

  gu: {
    welcome: "Doctor Near Me માં આપનું સ્વાગત છે.",
    selectLanguage: "કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો:",
    askLocation: "કૃપા કરીને WhatsApp લોકેશન શેરિંગ દ્વારા તમારું વર્તમાન સ્થાન મોકલો.",
    searching: "તમારા નજીકના ક્લિનિક શોધી રહ્યા છીએ...",
    noClinics: "માફ કરશો, તમારા સ્થાનથી 5 કિમીની અંદર કોઈ ક્લિનિક મળ્યું નથી.",
    foundClinics: "તમારા નજીકના મુખ્ય ક્લિનિક અહીં છે. કૃપા કરીને એક પસંદ કરો:",
    selectDoctor: "કૃપા કરીને આ ક્લિનિકમાંથી ડૉક્ટર પસંદ કરો:",
    selectDate: "એપોઇન્ટમેન્ટ માટે તારીખ પસંદ કરો:",
    selectSlot: "ઉપલબ્ધ સમય સ્લોટ પસંદ કરો:",
    confirmBooking: (details) =>
      `કૃપા કરીને તમારી બુકિંગની પુષ્ટિ કરો:\n\nડૉક્ટર: ${details.doctor}\nક્લિનિક: ${details.clinic}\nતારીખ: ${details.date}\nસમય: ${details.slot}\nફી: ₹${details.fee}\n\nશું તમે આ એપોઇન્ટમેન્ટ કન્ફર્મ કરવા માંગો છો?`,
    bookingSuccess: "તમારી એપોઇન્ટમેન્ટ સફળતાપૂર્વક કન્ફર્મ થઈ ગઈ છે.",
    bookingFailed: "માફ કરશો, આ સ્લોટ હમણાં જ બુક થઈ ગયો છે. કૃપા કરીને બીજો સમય પસંદ કરો.",
    invalidInput: "મને સમજાયું નથી. કૃપા કરીને આપેલા વિકલ્પોનો ઉપયોગ કરો અથવા ફરી પ્રયાસ કરો."
  }
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
