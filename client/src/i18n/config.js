import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "home": "Home",
      "search": "Search",
      "bookings": "Bookings",
      "profile": "Profile"
    }
  },
  hi: {
    translation: {
      "welcome": "नमस्ते",
      "home": "होम",
      "search": "खोजें",
      "bookings": "बुकिंग",
      "profile": "प्रोफ़ाइल"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
