import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, MessageSquare, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useStore } from "../store/useStore";
import noAppointmentsImg from "../assets/no-appointments.png";
import userLogo from "../assets/user_logo.png";

const specialties = [
  { id: "cardiologist", name: "Cardiologist", emoji: "🫀" },
  { id: "dermatologist", name: "Dermatologist", emoji: "✨" },
  { id: "neurologist", name: "Neurologist", emoji: "🧠" },
  { id: "orthopedic", name: "Orthopedic", emoji: "🦴" },
  { id: "dentist", name: "Dentist", emoji: "🦷" },
  { id: "general", name: "General", emoji: "🩺" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useStore();
  const today = format(new Date(), "EEEE, d MMMM");

  return (
    <div className="flex flex-col space-y-8 py-6">
      {/* Header Section */}
      <section className="px-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Good morning, {user?.name || "Alex"} 👋
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{today}</p>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-primary-100 dark:border-primary-900 overflow-hidden shadow-sm bg-white">
          <img
            src={userLogo}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Search Bar */}
      <section className="px-6">
        <div 
          onClick={() => navigate("/search")}
          className="flex items-center space-x-3 px-4 h-14 bg-zinc-100 dark:bg-zinc-800 rounded-2xl cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Search size={20} className="text-zinc-400" />
          <span className="text-zinc-400 dark:text-zinc-500">Search doctors, clinics...</span>
        </div>
      </section>

      {/* Specialty Chips */}
      <section>
        <div className="flex overflow-x-auto no-scrollbar space-x-3 px-6">
          {specialties.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/search?specialty=${s.id}`)}
              className="flex items-center space-x-2 shrink-0 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-full shadow-sm hover:border-primary-500 transition-colors"
            >
              <span>{s.emoji}</span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Clinics Near You */}
      <section className="space-y-4">
        <div className="px-6 flex justify-between items-center">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Clinics Near You</h2>
          <button 
            onClick={() => navigate("/search")}
            className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center"
          >
            See all <ArrowRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-4 px-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="shrink-0 w-64 card-premium flex flex-col group cursor-pointer"
              onClick={() => navigate(`/clinic/${i}`)}
            >
              <div className="h-32 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80&sig=${i}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="Clinic"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">City Health Clinic {i}</h3>
                <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 space-x-2">
                  <div className="flex items-center"><MapPin size={12} className="mr-0.5" /> 1.2 km</div>
                  <div className="flex items-center"><Star size={12} className="mr-0.5 text-yellow-400 fill-yellow-400" /> 4.8</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Appointments */}
      <section className="px-6 space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Upcoming Appointments</h2>
        <div className="card-premium p-6 flex flex-col items-center text-center space-y-4 bg-primary-50/50 dark:bg-primary-950/10 border-dashed border-primary-200 dark:border-primary-900">
          <img src={noAppointmentsImg} alt="No appointments" className="w-32 h-32 opacity-80" />
          <div className="space-y-1">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">No upcoming bookings</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 px-4">
              You don't have any appointments scheduled right now.
            </p>
          </div>
          <button 
            onClick={() => navigate("/search")}
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-primary-500/20"
          >
            Book your first appointment
          </button>
        </div>
      </section>

      {/* WhatsApp Banner */}
      <section className="px-6 pb-4">
        <div className="bg-emerald-500 rounded-3xl p-5 flex items-center justify-between text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
          <div className="relative z-10 space-y-1">
            <div className="flex items-center space-x-2">
              <MessageSquare size={18} fill="white" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">WhatsApp Bot</span>
            </div>
            <h3 className="text-xl font-black">Book via WhatsApp</h3>
            <p className="text-xs opacity-90 max-w-[150px]">Get prescriptions & book instantly via chat.</p>
            <button className="mt-2 px-4 py-1.5 bg-white text-emerald-600 rounded-full text-xs font-black shadow-sm hover:scale-105 transition-transform">
              Try Now
            </button>
          </div>
          <div className="relative z-10 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <MessageSquare size={40} fill="white" />
          </div>
          {/* Decorative background shape */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-400 rounded-full opacity-50" />
        </div>
      </section>
    </div>
  );
}
