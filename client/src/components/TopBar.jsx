import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();

  const isHome = location.pathname === '/';
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'ClinicBook';
    if (path === '/search') return 'Find Doctors';
    if (path === '/appointments') return 'My Bookings';
    if (path === '/profile') return 'Account';
    if (path.startsWith('/clinics')) return 'Clinic Details';
    return 'Back';
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 h-16 flex items-center justify-between px-4 transition-colors duration-500">
      <div className="flex items-center gap-3">
        {!isHome && (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        )}
        <h1 className={`font-bold text-lg transition-colors duration-500 ${isHome ? 'text-teal-600 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`}>
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme}
          className="relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ y: 20, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -20, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.3, ease: 'backOut' }}
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-600" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
        
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
