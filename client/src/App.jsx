import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/useStore";
import MainLayout from "./layouts/MainLayout";

// Pages (Placeholders with correct dark mode colors)
const Home = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
      Good Morning, Alex 👋
    </h1>
    <div className="card-premium p-4 h-40 flex items-center justify-center text-zinc-400 dark:text-zinc-500 italic">
      Upcoming Appointment Placeholder
    </div>
  </div>
);
const Search = () => (
  <div className="p-6 h-screen flex items-center justify-center text-zinc-400 dark:text-zinc-500">
    Map View Placeholder
  </div>
);
const MyBookings = () => (
  <div className="p-6 h-screen flex items-center justify-center text-zinc-400 dark:text-zinc-500">
    Bookings List Placeholder
  </div>
);
const Profile = () => (
  <div className="p-6 h-screen flex items-center justify-center text-zinc-400 dark:text-zinc-500">
    User Profile Placeholder
  </div>
);

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
        <Route path="/login" element={<div className="p-6 text-zinc-900 dark:text-zinc-100">Login</div>} />
      </Routes>
    </MainLayout>
  );
}

export default App;
