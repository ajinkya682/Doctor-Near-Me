import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "hello": "Hello,",
      "find_doctor": "Find Doctors",
      "search_placeholder": "Search doctors, clinics...",
      "specialties": "Specialties",
      "clinics_near_you": "Clinics Near You",
      "whatsapp_promo": "Book faster via WhatsApp",
      "home": "Home",
      "search": "Search",
      "bookings": "Bookings",
      "profile": "Profile",
      "upcoming": "Upcoming",
      "past": "Past",
      "language": "Language",
      "dark_mode": "Dark Mode",
      "logout": "Logout",
    }
  },
  hi: {
    translation: {
      "hello": "नमस्ते,",
      "find_doctor": "डॉक्टर खोजें",
      "search_placeholder": "डॉक्टर, क्लीनिक खोजें...",
      "specialties": "विशेषताएं",
      "clinics_near_you": "आपके पास के क्लीनिक",
      "whatsapp_promo": "व्हाट्सएप के जरिए तेजी से बुक करें",
      "home": "मुख्य",
      "search": "खोजें",
      "bookings": "बुकिंग",
      "profile": "प्रोफाइल",
      "upcoming": "आगामी",
      "past": "पिछला",
      "language": "भाषा",
      "dark_mode": "डार्क मोड",
      "logout": "लॉग आउट",
    }
  },
  mr: {
    translation: {
      "hello": "नमस्कार,",
      "find_doctor": "डॉक्टर शोधा",
      "search_placeholder": "डॉक्टर, क्लिनिक शोधा...",
      "specialties": "वैशिष्ट्ये",
      "clinics_near_you": "तुमच्या जवळील क्लिनिक",
      "whatsapp_promo": "व्हॉट्सॲपद्वारे जलद बुक करा",
      "home": "मुख्य",
      "search": "शोध",
      "bookings": "बुकिंग",
      "profile": "प्रोफाइल",
      "upcoming": "येणारे",
      "past": "मागील",
      "language": "भाषा",
      "dark_mode": "डार्क मोड",
      "logout": "लॉग आउट",
    }
  },
  gu: {
    translation: {
      "hello": "નમસ્તે,",
      "find_doctor": "ડોક્ટર શોધો",
      "search_placeholder": "ડોક્ટર, ક્લિનિક શોધો...",
      "specialties": "વિશેષતાઓ",
      "clinics_near_you": "તમારી નજીકના ક્લિનિક્સ",
      "whatsapp_promo": "વોટ્સએપ દ્વારા ઝડપથી બુક કરો",
      "home": "મુખ્ય",
      "search": "શોધ",
      "bookings": "બુકિંગ",
      "profile": "પ્રોફાઇલ",
      "upcoming": "આગામી",
      "past": "ભૂતકાળ",
      "language": "ભાષા",
      "dark_mode": "ડાર્ક મોડ",
      "logout": "લોગ આઉટ",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
