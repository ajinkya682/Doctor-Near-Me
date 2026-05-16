import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/appointments' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl h-20 flex items-center justify-around px-4 z-50 rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.2)] transition-colors duration-500">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="relative flex flex-col items-center justify-center p-2 min-w-[70px] h-full"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.1 }}
              className={`flex flex-col items-center transition-all duration-300 ${
                isActive 
                ? 'text-teal-600 dark:text-teal-400 -translate-y-1' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon 
                size={24} 
                strokeWidth={isActive ? 2.5 : 2} 
                className="transition-all duration-300"
              />
              <span className={`text-[10px] mt-1 font-bold tracking-tight transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
            </motion.div>

            {isActive && (
              <motion.div
                layoutId="activeTabDot"
                className="absolute bottom-2 w-1.5 h-1.5 bg-teal-600 dark:bg-teal-400 rounded-full shadow-[0_0_8px_rgba(13,148,136,0.5)]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
