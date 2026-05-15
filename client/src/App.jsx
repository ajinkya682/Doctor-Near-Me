import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/useStore";
import MainLayout from "./layouts/MainLayout";

// Pages (Placeholders)
const Home = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Good Morning, Alex 👋</h1>
    <div className="card-premium p-4 h-40 flex items-center justify-center text-zinc-400">
      Upcoming Appointment Placeholder
    </div>
  </div>
);
const Search = () => <div className="p-6 h-screen flex items-center justify-center text-zinc-400">Map View Placeholder</div>;
const MyBookings = () => <div className="p-6 h-screen flex items-center justify-center text-zinc-400">Bookings List Placeholder</div>;
const Profile = () => <div className="p-6 h-screen flex items-center justify-center text-zinc-400">User Profile Placeholder</div>;

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

  return (
    <MainLayout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<div className="p-6">Login</div>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
