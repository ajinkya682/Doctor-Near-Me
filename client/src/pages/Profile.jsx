import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Settings, Bell, Globe, Moon, Sun, 
  HelpCircle, Shield, LogOut, Trash2, Camera,
  ChevronRight, Calendar, Star, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore, useLanguageStore } from '../store/useStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const navigate = useNavigate();
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const stats = [
    { label: 'Appointments', value: user?.bookingIds?.length || 0, icon: <Calendar size={16} /> },
    { label: 'Reviews', value: 0, icon: <Star size={16} /> },
    { label: 'Member Since', value: '2024', icon: <Info size={16} /> }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' }
  ];

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-24">
      {/* Profile Header */}
      <section className="p-8 pt-12 flex flex-col items-center">
         <div className="relative group mb-4">
            <div className="w-28 h-28 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden">
               {user?.profilePhoto ? (
                 <img src={user.profilePhoto} className="w-full h-full object-cover" alt={user.name} />
               ) : (
                 <User size={48} />
               )}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-teal-600 text-white rounded-full border-4 border-white dark:border-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
               <Camera size={18} />
            </button>
         </div>
         <h1 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name || 'New Patient'}</h1>
         <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">{user?.phone || '+91 00000 00000'}</p>
      </section>

      {/* Stats Row */}
      <section className="px-6 grid grid-cols-3 gap-3 mb-8">
         {stats.map((stat, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 text-center space-y-1">
               <div className="flex justify-center text-teal-500 mb-1">{stat.icon}</div>
               <p className="text-lg font-black text-gray-900 dark:text-white">{stat.value}</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</p>
            </div>
         ))}
      </section>

      {/* Settings Sections */}
      <section className="px-6 space-y-6">
         <div className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Settings</h3>
            <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden">
               {/* Language */}
               <button 
                onClick={() => setShowLanguageSheet(true)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600"><Globe size={20} /></div>
                     <span className="text-sm font-black text-gray-700 dark:text-gray-300">Language</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold text-gray-400">{languages.find(l => l.code === language)?.name}</span>
                     <ChevronRight size={18} className="text-gray-300" />
                  </div>
               </button>

               {/* Theme */}
               <div className="w-full flex items-center justify-between p-5 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                     </div>
                     <span className="text-sm font-black text-gray-700 dark:text-gray-300">Dark Mode</span>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-teal-600' : 'bg-gray-200'}`}
                  >
                     <motion.div 
                        animate={{ x: theme === 'dark' ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-sm" 
                     />
                  </button>
               </div>

               {/* Notifications */}
               <div className="w-full flex items-center justify-between p-5 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600"><Bell size={20} /></div>
                     <span className="text-sm font-black text-gray-700 dark:text-gray-300">Notifications</span>
                  </div>
                  <button className="w-12 h-6 rounded-full p-1 bg-teal-600">
                     <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                  </button>
               </div>
            </div>
         </div>

         <div className="space-y-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Support</h3>
            <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden">
               <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600"><HelpCircle size={20} /></div>
                     <span className="text-sm font-black text-gray-700 dark:text-gray-300">Help & Support</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </button>
               <button className="w-full flex items-center justify-between p-5 border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600"><Shield size={20} /></div>
                     <span className="text-sm font-black text-gray-700 dark:text-gray-300">Privacy Policy</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </button>
            </div>
         </div>

         {/* Danger Zone */}
         <div className="space-y-3 pt-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-5 bg-red-50 dark:bg-red-900/10 rounded-[32px] text-red-600 hover:bg-red-100 transition-colors border border-red-100 dark:border-red-900/20"
            >
               <div className="w-10 h-10 bg-white dark:bg-red-900/30 rounded-xl flex items-center justify-center shadow-sm"><LogOut size={20} /></div>
               <span className="text-sm font-black uppercase tracking-widest">Logout</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-4 text-red-400 font-bold text-[10px] uppercase tracking-widest opacity-60">
               <Trash2 size={12} /> Delete Account
            </button>
         </div>
      </section>

      {/* Language Bottom Sheet */}
      <AnimatePresence>
         {showLanguageSheet && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => setShowLanguageSheet(false)}
                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
               />
               <motion.div 
                 initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                 className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-[40px] z-[51] p-8"
               >
                  <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8" />
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6">Select Language</h3>
                  <div className="grid grid-cols-1 gap-3">
                     {languages.map(lang => (
                        <button 
                          key={lang.code}
                          onClick={() => { setLanguage(lang.code); setShowLanguageSheet(false); }}
                          className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${
                            language === lang.code 
                            ? 'bg-teal-50 border-teal-600 text-teal-600' 
                            : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-400'
                          }`}
                        >
                           <div className="flex items-center gap-4">
                              <span className="text-2xl">{lang.flag}</span>
                              <span className="font-black text-sm">{lang.name}</span>
                           </div>
                           {language === lang.code && <div className="w-3 h-3 bg-teal-600 rounded-full" />}
                        </button>
                     ))}
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
