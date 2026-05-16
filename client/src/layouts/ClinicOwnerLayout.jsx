import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, Hospital, Star, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClinicOwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/clinic/dashboard' },
    { label: 'Bookings', icon: Calendar, path: '/clinic/appointments' },
    { label: 'Clinics', icon: Hospital, path: '/clinic/clinics' },
    { label: 'Reviews', icon: Star, path: '/clinic/reviews' },
    { label: 'Profile', icon: User, path: '/clinic/profile' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
      {/* Desktop Sidebar (Placeholder) */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-teal-600">Clinic Dashboard</h2>
        </div>
        <nav className="flex-grow px-4 gap-2 flex flex-col">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' 
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col pb-20 md:pb-0">
        {/* Top Nav (Mobile/Desktop) */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 justify-between">
          <h1 className="font-semibold md:hidden text-teal-600">ClinicBook</h1>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full" />
          </div>
        </header>
        
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around items-center px-2 z-50">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 ${isActive ? 'text-teal-600' : 'text-gray-400'}`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ClinicOwnerLayout;
