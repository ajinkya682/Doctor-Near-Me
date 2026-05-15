import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, CreditCard, FileText, CheckCircle2, Share2, CalendarPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, date, slot } = location.state || {};
  
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!doctor) {
    return <div className="p-10 text-center">No booking data found.</div>;
  }

  const handleConfirm = () => {
    setIsBooking(true);
    // Simulate API Call
    setTimeout(() => {
      setIsBooking(false);
      setIsSuccess(true);
    }, 2000);
  };

  const bookingId = "DNM-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full bg-white dark:bg-zinc-900 px-6 py-12 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-6"
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="w-12 h-12 text-emerald-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              d="M20 6L9 17l-5-5"
            />
          </motion.svg>
        </motion.div>

        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Booking Confirmed!</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Your appointment with {doctor.name} has been successfully scheduled.
        </p>

        <div className="w-full card-premium p-6 mb-8 space-y-4 bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Booking ID</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{bookingId}</span>
          </div>
          <div className="border-t border-dashed border-zinc-200 dark:border-zinc-700 pt-4 space-y-3">
             <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
               <Calendar size={16} className="text-primary-500" />
               <span>{format(new Date(date), "EEEE, d MMMM yyyy")}</span>
             </div>
             <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-300">
               <Clock size={16} className="text-primary-500" />
               <span>{slot}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 w-full">
          <button className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold flex items-center justify-center space-x-3">
            <CalendarPlus size={20} />
            <span>Add to Calendar</span>
          </button>
          <button 
            onClick={() => navigate("/my-bookings")}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black shadow-lg shadow-primary-500/20"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-900 pb-10 relative">
      <AnimatePresence>
        {isBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex flex-col items-center justify-center"
          >
             <div className="w-20 h-20 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin mb-4" />
             <p className="font-bold text-primary-600 animate-pulse text-lg">Confirming Booking...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-6 pt-6 flex items-center space-x-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Booking Summary</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Doctor Summary */}
        <div className="card-premium p-4 flex items-center space-x-4">
          <img src={doctor.image} className="w-20 h-20 rounded-2xl object-cover" alt="" />
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{doctor.name}</h3>
            <p className="text-xs text-primary-600 font-medium">{doctor.specialty}</p>
            <p className="text-[10px] text-zinc-400 mt-1 flex items-center">
              <Star size={10} className="mr-0.5 fill-yellow-400 text-yellow-400" />
              {doctor.rating} ({doctor.reviews} Reviews)
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="card-premium p-6 space-y-6">
          <div className="flex justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Date</span>
              <div className="flex items-center space-x-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                <Calendar size={16} className="text-primary-600" />
                <span>{format(new Date(date), "EEEE, d MMM yyyy")}</span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Time</span>
              <div className="flex items-center justify-end space-x-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                <Clock size={16} className="text-primary-600" />
                <span>{slot}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 border-y border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-lg">
                <CreditCard size={18} className="text-primary-600" />
              </div>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Consultation Fee</span>
            </div>
            <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">{doctor.fee}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-zinc-400">
              <FileText size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Patient Notes (Optional)</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tell the doctor about your symptoms..."
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-sm outline-none border-2 border-transparent focus:border-primary-500 transition-all resize-none h-32"
            />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-4">
          <button 
            onClick={handleConfirm}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
          >
            Confirm Booking
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-4 text-zinc-500 dark:text-zinc-400 font-bold hover:text-zinc-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
