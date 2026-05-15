import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, MoreVertical, X, AlertCircle, CheckCircle2, Star, RotateCcw } from "lucide-react";
import { format } from "date-fns";

const UPCOMING_DEMO = [
  {
    id: "b1",
    doctor: { name: "Dr. Sarah Johnson", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
    clinic: "City Health Center",
    date: new Date(2026, 0, 15, 10, 30),
    status: "Confirmed",
  },
  {
    id: "b2",
    doctor: { name: "Dr. Michael Chen", specialty: "Dermatologist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400" },
    clinic: "Surya Multispeciality",
    date: new Date(2026, 0, 18, 14, 0),
    status: "Pending",
  }
];

const PAST_DEMO = [
  {
    id: "b3",
    doctor: { name: "Dr. Sarah Johnson", specialty: "Cardiologist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
    clinic: "City Health Center",
    date: new Date(2025, 11, 20, 11, 0),
    status: "Completed",
    hasReview: false,
  },
  {
    id: "b4",
    doctor: { name: "Dr. Emily Blunt", specialty: "General Physician", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400" },
    clinic: "Apex Care",
    date: new Date(2025, 11, 10, 15, 30),
    status: "Cancelled",
  }
];

export default function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelSheet, setShowCancelSheet] = useState(null);

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-900 pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">My Bookings</h1>
      </div>

      {/* Segmented Control */}
      <div className="px-6 mb-6">
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl relative">
          <motion.div
            layoutId="tab-indicator"
            className="absolute top-1.5 bottom-1.5 bg-white dark:bg-zinc-700 rounded-xl shadow-sm z-0"
            animate={{ 
              left: activeTab === "upcoming" ? "6px" : "50%",
              right: activeTab === "upcoming" ? "50%" : "6px"
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${
              activeTab === "upcoming" ? "text-primary-600" : "text-zinc-500"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2.5 text-sm font-bold z-10 transition-colors ${
              activeTab === "past" ? "text-primary-600" : "text-zinc-500"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Booking List */}
      <div className="px-6 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === "upcoming" ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === "upcoming" ? 10 : -10 }}
            className="space-y-4"
          >
            {(activeTab === "upcoming" ? UPCOMING_DEMO : PAST_DEMO).map((booking) => (
              <div key={booking.id} className="card-premium p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <img src={booking.doctor.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{booking.doctor.name}</h3>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{booking.doctor.specialty} • {booking.clinic}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    booking.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" :
                    booking.status === "Pending" ? "bg-yellow-50 text-yellow-600" :
                    booking.status === "Completed" ? "bg-primary-50 text-primary-600" :
                    "bg-zinc-100 text-zinc-500"
                  }`}>
                    {booking.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-50 dark:border-zinc-800">
                  <div className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <Calendar size={14} className="text-primary-500" />
                    <span>{format(booking.date, "d MMM, yyyy")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <Clock size={14} className="text-primary-500" />
                    <span>{format(booking.date, "hh:mm a")}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-1">
                  {activeTab === "upcoming" ? (
                    <>
                      <button className="flex-1 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl text-xs font-bold hover:bg-zinc-200 transition-colors">
                        Reschedule
                      </button>
                      <button 
                        onClick={() => setShowCancelSheet(booking)}
                        className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : booking.status === "Completed" ? (
                    <button className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <Star size={14} />
                      <span>Write a Review</span>
                    </button>
                  ) : (
                    <button className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl text-xs font-bold flex items-center justify-center space-x-2">
                      <RotateCcw size={14} />
                      <span>Book Again</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cancel Confirmation Bottom Sheet */}
      <AnimatePresence>
        {showCancelSheet && (
          <div className="fixed inset-0 z-[1000] flex items-end justify-center px-4 pb-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelSheet(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-mobile bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertCircle size={32} className="text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Cancel Appointment?</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Are you sure you want to cancel your appointment with {showCancelSheet.doctor.name}? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => setShowCancelSheet(null)}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Yes, Cancel Booking
                </button>
                <button 
                  onClick={() => setShowCancelSheet(null)}
                  className="w-full py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold"
                >
                  No, Keep It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
