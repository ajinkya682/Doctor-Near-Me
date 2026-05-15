import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { Toaster, toast } from "react-hot-toast";
import { socket } from "./lib/socket";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ClinicDetail from "./pages/ClinicDetail";
import DoctorProfile from "./pages/DoctorProfile";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { theme } = useStore();
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Socket Connection & Listeners (Disabled for Demo Mode)
  useEffect(() => {
    /*
    socket.connect();
    const mockUserId = "user-123"; 
    socket.emit("join_room", mockUserId);
    ...
    */
  }, [theme]);

  return (
    <>
      <Toaster />
      <MainLayout>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/clinic/:id" element={<ClinicDetail />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/booking-confirm" element={<BookingConfirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Dashboard Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          <Route path="/login" element={<div className="p-6 text-zinc-900 dark:text-zinc-100">Login</div>} />
        </Routes>
      </MainLayout>
    </>
  );
}

export default App;
