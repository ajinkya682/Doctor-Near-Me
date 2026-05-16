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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 h-20 flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="relative flex flex-col items-center gap-1 p-2 min-w-[64px]"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className={`flex flex-col items-center ${isActive ? 'text-teal-500' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </motion.div>

            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-1 w-12 h-1 bg-teal-500 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
