import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/useStore";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";

// Pages (Placeholders)
const Search = () => (
  <div className="p-6 h-screen flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
    <h2 className="text-xl font-bold mb-2">Search & Map View</h2>
    <p>Coming in Part 9...</p>
  </div>
);
const MyBookings = () => (
  <div className="p-6 h-screen flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
    <h2 className="text-xl font-bold mb-2">My Bookings</h2>
    <p>Loading your appointments...</p>
  </div>
);
const Profile = () => (
  <div className="p-6 h-screen flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
    <h2 className="text-xl font-bold mb-2">User Profile</h2>
    <p>Manage your account...</p>
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
