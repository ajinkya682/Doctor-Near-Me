import { Outlet } from 'react-router-dom';
import { ShieldCheck, Users, Hospital, BarChart3, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Admin Home', icon: ShieldCheck, path: '/admin/dashboard' },
    { label: 'Approvals', icon: ShieldCheck, path: '/admin/approvals' },
    { label: 'Clinics', icon: Hospital, path: '/admin/clinics' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex">
      {/* Sidebar (Desktop Only) */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
        <div className="p-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">SUPER <span className="text-red-600">ADMIN</span></h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Platform Control</p>
        </div>
        
        <nav className="flex-grow px-4 mt-4 space-y-2">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group ${
                location.pathname === item.path 
                ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 dark:shadow-none' 
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <item.icon size={22} className={location.pathname === item.path ? 'text-red-500' : 'group-hover:scale-110 transition-transform'} />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
           <button className="w-full flex items-center gap-4 px-6 py-4 text-gray-500 hover:text-red-600 transition-colors">
              <Settings size={22} />
              <span className="font-semibold">Settings</span>
           </button>
        </div>
      </aside>

      <main className="flex-grow p-10 max-h-screen overflow-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-green-500 font-bold">● ONLINE</p>
             </div>
             <img src="https://ui-avatars.com/api/?name=Admin&background=random" className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" alt="Admin" />
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
