import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Clock, ShieldCheck, Heart, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { format, addDays, startOfToday } from "date-fns";

const DEMO_DOCTOR = {
  id: "d1",
  name: "Dr. Sarah Johnson",
  specialty: "Cardiologist",
  rating: 4.9,
  reviews: 245,
  experience: "12+ years",
  patients: "5k+",
  fee: "$50",
  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600",
  about: "Dr. Sarah Johnson is a world-class cardiologist with over 12 years of experience in treating complex heart conditions. She specialized in preventative cardiology and cardiovascular imaging.",
  slots: ["09:00 AM", "10:30 AM", "11:00 AM", "01:30 PM", "04:00 PM"]
};

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = DEMO_DOCTOR;

  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");

  const today = startOfToday();
  const nextDays = Array.from({ length: 8 }).map((_, i) => addDays(today, i));
  const currentMonthYear = format(today, "MMMM yyyy");

  const handleBook = () => {
    if (!selectedSlot) {
      alert("Please select a time slot first!");
      return;
    }
    navigate("/booking-confirm", {
      state: {
        doctor,
        date: nextDays[selectedDateIdx].toISOString(),
        slot: selectedSlot
      }
    });
  };

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-900 pb-10">
      {/* Header */}
      <div className="px-6 pt-6 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/30 pb-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm text-zinc-900 dark:text-zinc-100">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Doctor Profile</h1>
        <button className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm text-zinc-900 dark:text-zinc-100">
          <Heart size={24} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-6 -mt-6">
        <div className="card-premium p-6 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img src={doctor.image} className="w-28 h-28 rounded-3xl object-cover border-4 border-white dark:border-zinc-800 shadow-xl" alt="" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-full border-4 border-white dark:border-zinc-800">
              <ShieldCheck size={16} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{doctor.name}</h2>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{doctor.specialty}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-8 w-full py-4 border-y border-zinc-100 dark:border-zinc-800">
            <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-400 font-medium">Patients</span>
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{doctor.patients}</span>
            </div>
            <div className="flex flex-col items-center border-x border-zinc-100 dark:border-zinc-800">
              <span className="text-xs text-zinc-400 font-medium">Exp.</span>
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{doctor.experience}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-zinc-400 font-medium">Rating</span>
              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{doctor.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-6 mt-8 space-y-3">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">About Doctor</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {doctor.about}
        </p>
      </div>

      {/* Availability Section */}
      <div className="px-6 mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Select Date</h3>
          <span className="text-xs text-primary-600 font-bold uppercase tracking-widest">{currentMonthYear}</span>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
          {nextDays.map((date, index) => {
            const isSelected = selectedDateIdx === index;
            return (
              <motion.div 
                whileTap={{ scale: 0.95 }}
                key={index} 
                onClick={() => setSelectedDateIdx(index)}
                className={`shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${isSelected ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
              >
                <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                  {format(date, "EEE")}
                </span>
                <span className="text-lg font-black">{format(date, "d")}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Available Slots</h3>
        <div className="grid grid-cols-3 gap-3">
          {doctor.slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border-2 ${
                selectedSlot === slot 
                ? "bg-primary-50 border-primary-600 text-primary-600 dark:bg-primary-950/30" 
                : "bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Integrated Action Button */}
      <div className="px-6 mt-10 pb-4">
        <button 
          onClick={handleBook}
          className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center space-x-3"
        >
          <Calendar size={20} />
          <span>Book Appointment</span>
        </button>
      </div>
    </div>
  );
}
