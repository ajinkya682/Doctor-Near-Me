import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", sub: "English" },
  { code: "hi", label: "हिंदी", sub: "Hindi" },
  { code: "mr", label: "मराठी", sub: "Marathi" },
  { code: "gu", label: "ગુજરાતી", sub: "Gujarati" }
];

export default function LanguageBottomSheet({ isOpen, onClose }) {
  const { i18n } = useTranslation();

  const handleLanguageSelect = (code) => {
    i18n.changeLanguage(code);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto bg-white dark:bg-zinc-900 rounded-t-3xl z-[101] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Select Language</h3>
                <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                      i18n.language === lang.code
                        ? "border-primary-600 bg-primary-50 dark:bg-primary-950/20"
                        : "border-zinc-50 dark:border-zinc-800 bg-white dark:bg-zinc-800/50"
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-bold ${i18n.language === lang.code ? "text-primary-600" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {lang.label}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">{lang.sub}</p>
                    </div>
                    {i18n.language === lang.code && <Check size={20} className="text-primary-600" />}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
