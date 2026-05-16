import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, TrendingUp, Star, 
  Clock, CheckCircle2, XCircle, ChevronRight,
  MoreVertical, MessageSquare
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../../api/axios';

const ClinicDashboard = () => {
  // Fetch Real Stats & Appointments (Mocked for now but structure is real)
  const stats = [
    { label: "Today's Appointments", value: "12", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Confirmations", value: "05", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "This Month Revenue", value: "₹45.2K", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Average Rating", value: "4.8", icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const todayAppointments = [
    { id: 1, patient: "Rahul Sharma", time: "09:00 AM", doctor: "Dr. Amit Mehta", status: "confirmed" },
    { id: 2, patient: "Sonia Gandhi", time: "10:30 AM", doctor: "Dr. Amit Mehta", status: "pending" },
    { id: 3, patient: "Vikram Seth", time: "11:00 AM", doctor: "Dr. Sarah Johnson", status: "completed" },
    { id: 4, patient: "Anjali Gupta", time: "01:30 PM", doctor: "Dr. Sarah Johnson", status: "cancelled" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting */}
      <header>
         <h1 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back, City Care!</h1>
         <p className="text-gray-500 dark:text-gray-400 font-bold mt-1">Here's what's happening today, {format(new Date(), 'MMMM dd')}.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5"
            >
               <div className={`w-12 h-12 ${stat.bg} dark:bg-gray-800 rounded-2xl flex items-center justify-center ${stat.color} mb-4`}>
                  <stat.icon size={24} />
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Today's Timeline */}
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Today's Schedule</h2>
               <button className="text-teal-600 font-black text-xs uppercase tracking-widest flex items-center gap-1">View Timeline <ChevronRight size={14} /></button>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 overflow-hidden">
               <div className="p-6 space-y-6">
                  {todayAppointments.map((apt, i) => (
                     <div key={apt.id} className="flex gap-6 relative">
                        {/* Time Line Line */}
                        {i !== todayAppointments.length - 1 && (
                           <div className="absolute left-[23px] top-10 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-gray-800" />
                        )}
                        
                        <div className="min-w-[50px] text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase leading-none">{apt.time.split(' ')[1]}</p>
                           <p className="text-sm font-black text-gray-900 dark:text-white mt-1">{apt.time.split(' ')[0]}</p>
                        </div>

                        <div className="flex-grow bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                           <div className="flex gap-3 items-center">
                              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-700">
                                 <Users size={20} />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-gray-900 dark:text-white">{apt.patient}</h4>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{apt.doctor}</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 apt.status === 'confirmed' ? 'bg-blue-100 text-blue-600' :
                                 apt.status === 'completed' ? 'bg-green-100 text-green-600' :
                                 apt.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                 'bg-orange-100 text-orange-600'
                              }`}>
                                 {apt.status}
                              </span>
                              <button className="text-gray-400"><MoreVertical size={18} /></button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Recent Reviews */}
         <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Recent Reviews</h2>
            <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 p-6 space-y-6">
               {[1, 2].map((r) => (
                  <div key={r} className="space-y-3">
                     <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                           <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-black">JS</div>
                           <div>
                              <h4 className="text-sm font-black text-gray-900 dark:text-white">John Smith</h4>
                              <div className="flex text-orange-400">
                                 {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                              </div>
                           </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">2h ago</span>
                     </div>
                     <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                        "Great service and friendly doctor. The wait time was minimal."
                     </p>
                     <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5 bg-teal-50 dark:bg-teal-900/30 px-3 py-2 rounded-xl">
                        <MessageSquare size={12} /> Reply to Review
                     </button>
                  </div>
               ))}
               <button className="w-full py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                  View All Reviews
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;
