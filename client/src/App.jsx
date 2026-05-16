import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { useThemeStore, useLanguageStore } from './store/useStore';
import i18n from './i18n/config';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import ClinicOwnerLayout from './layouts/ClinicOwnerLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import ClinicDetail from './pages/ClinicDetail';
import ClinicLogin from './pages/ClinicLogin';
import ClinicRegister from './pages/ClinicRegister';
import ClinicPending from './pages/ClinicPending';

const Appointments = () => <div>My Bookings</div>;
const Profile = () => <div>Profile Page</div>;
const ClinicDashboard = () => <div>Clinic Dashboard</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;

const queryClient = new QueryClient();

function App() {
  const { theme } = useThemeStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/clinic/login" element={<ClinicLogin />} />
            <Route path="/clinic/register" element={<ClinicRegister />} />
            <Route path="/clinic/pending" element={<ClinicPending />} />

            {/* Patient App (480px Centered) */}
            <Route path="/" element={<PatientLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="clinics/:id" element={<ClinicDetail />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="profile" element={<Profile />} />
              <Route path="clinics/:slug" element={<div>Clinic Detail</div>} />
              <Route path="doctors/:id" element={<div>Doctor Profile</div>} />
              <Route path="notifications" element={<div>Notifications</div>} />
            </Route>

            {/* Clinic Owner App (Responsive Sidebar) */}
            <Route path="/clinic" element={<ClinicOwnerLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<ClinicDashboard />} />
              <Route path="appointments" element={<div>Clinic Bookings</div>} />
              <Route path="clinics" element={<div>My Clinics</div>} />
              <Route path="analytics" element={<div>Analytics</div>} />
              <Route path="reviews" element={<div>Reviews</div>} />
              <Route path="profile" element={<div>Owner Profile</div>} />
            </Route>

            {/* Admin Portal (Desktop Sidebar) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="approvals" element={<div>Pending Approvals</div>} />
              <Route path="clinics" element={<div>Manage Clinics</div>} />
              <Route path="users" element={<div>Manage Patients</div>} />
              <Route path="analytics" element={<div>System Analytics</div>} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </AnimatePresence>
      </Router>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;
