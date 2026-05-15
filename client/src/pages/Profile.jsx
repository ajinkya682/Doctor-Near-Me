import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, User, Phone, Mail, Languages, Moon, Sun, Bell, Info, LogOut, ChevronRight, Check, ShieldCheck } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState("Ajinkya Saivar");
  const [language, setLanguage] = useState("English");
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const languages = ["English", "Hindi", "Marathi", "Gujarati"];

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-900 pb-8">
      {/* Header / Profile Hero */}
      <div className="px-6 pt-10 pb-8 flex flex-col items-center bg-zinc-50 dark:bg-zinc-800/30">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl overflow-hidden bg-zinc-200">
            <img 
              src="/src/assets/user_logo.png" 
              className="w-full h-full object-cover" 
              alt="Profile"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400";
              }}
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full border-2 border-white dark:border-zinc-800 text-white shadow-lg shadow-primary-500/20 active:scale-90 transition-transform">
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center space-y-1">
          {isEditingName ? (
            <input 
              autoFocus
              className="text-xl font-black bg-transparent border-b-2 border-primary-500 outline-none text-center text-zinc-900 dark:text-zinc-100"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
            />
          ) : (
            <h2 
              onClick={() => setIsEditingName(true)}
              className="text-xl font-black text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              {userName}
            </h2>
          )}
          <p className="text-xs text-zinc-500 font-medium">+91 98765 43210</p>
        </div>
      </div>

      {/* Profile Details List */}
      <div className="px-6 py-6 space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-4 ml-2">Personal Info</h3>
        <div className="card-premium divide-y divide-zinc-50 dark:divide-zinc-800">
          <div className="p-4 flex items-center space-x-4">
            <Mail size={18} className="text-zinc-400" />
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase">Email Address</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">ajinkya.dev@example.com</p>
            </div>
          </div>
          <div className="p-4 flex items-center space-x-4">
            <Phone size={18} className="text-zinc-400" />
            <div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase">Phone Number</p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-6 py-4 space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-4 ml-2">App Settings</h3>
        <div className="card-premium divide-y divide-zinc-50 dark:divide-zinc-800">
          {/* Language Selection */}
          <button 
            onClick={() => setShowLanguageSheet(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Languages size={18} className="text-primary-600" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Language</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400">{language}</span>
              <ChevronRight size={16} className="text-zinc-300" />
            </div>
          </button>

          {/* Theme Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {theme === "dark" ? <Moon size={18} className="text-primary-600" /> : <Sun size={18} className="text-primary-600" />}
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Dark Mode</span>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${theme === "dark" ? 'bg-primary-600' : 'bg-zinc-200'}`}
            >
              <motion.div 
                animate={{ x: theme === "dark" ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell size={18} className="text-primary-600" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Notifications</span>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative ${notifications ? 'bg-primary-600' : 'bg-zinc-200'}`}
            >
              <motion.div 
                animate={{ x: notifications ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          {/* About */}
          <button className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center space-x-4">
              <Info size={18} className="text-primary-600" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">About App</span>
            </div>
            <ChevronRight size={16} className="text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Developer / Quick Access (For Demo) */}
      <div className="px-6 py-4 space-y-2">
        <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-4 ml-2">Developer Access</h3>
        <div className="card-premium divide-y divide-zinc-50 dark:divide-zinc-800">
          <button 
            onClick={() => navigate("/doctor/dashboard")}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <User size={18} className="text-zinc-400" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Doctor Dashboard</span>
            </div>
            <ChevronRight size={16} className="text-zinc-300" />
          </button>
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <ShieldCheck size={18} className="text-zinc-400" />
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</span>
            </div>
            <ChevronRight size={16} className="text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="px-6 py-8">
        <button className="w-full py-4 border-2 border-red-50 dark:border-red-900/20 text-red-600 rounded-2xl font-black flex items-center justify-center space-x-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <p className="text-center text-[10px] text-zinc-400 font-bold mt-6 uppercase tracking-widest">Version 1.0.0 (Build 2023.10)</p>
      </div>

      {/* Language Bottom Sheet */}
      <AnimatePresence>
        {showLanguageSheet && (
          <div className="fixed inset-0 z-[1000] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageSheet(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-mobile bg-white dark:bg-zinc-900 rounded-t-3xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-6">Select Language</h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageSheet(false);
                    }}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between font-bold transition-all ${
                      language === lang 
                      ? "bg-primary-50 dark:bg-primary-950/30 text-primary-600" 
                      : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span>{lang}</span>
                    {language === lang && <Check size={20} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
