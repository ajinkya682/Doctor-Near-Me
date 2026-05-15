import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/useStore";

// Pages (Placeholders)
const Home = () => <div className="p-4">Home Page</div>;
const Search = () => <div className="p-4">Search Page</div>;
const ClinicDetail = () => <div className="p-4">Clinic Detail</div>;
const DoctorProfile = () => <div className="p-4">Doctor Profile</div>;
const BookAppointment = () => <div className="p-4">Book Appointment</div>;
const MyBookings = () => <div className="p-4">My Bookings</div>;
const Login = () => <div className="p-4">Login Page</div>;
const NotFound = () => <div className="p-4 text-center">404 - Page Not Found</div>;

function App() {
  const { theme } = useStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/clinic/:id" element={<ClinicDetail />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
