import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, ChevronRight, 
  Search, Star, Filter, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../api/axios';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past
  const navigate = useNavigate();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', activeTab],
    queryFn: async () => {
      const res = await api.get('/appointments', {
        params: { timeframe: activeTab }
      });
      return res.data;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'completed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-24">
      {/* Header */}
      <header className="p-6 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">My Bookings</h1>
            <button className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-800"><Filter size={20} /></button>
         </div>

         {/* Tabs */}
         <div className="flex p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
            {['upcoming', 'past'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-grow py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-800 text-teal-600 shadow-sm' : 'text-gray-400'}`}
               >
                  {tab}
               </button>
            ))}
         </div>
      </header>

      {/* List */}
      <div className="px-6 space-y-4">
         {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-50 dark:bg-gray-900 animate-pulse rounded-[32px]" />)
         ) : appointments?.length > 0 ? (
            <AnimatePresence mode="popLayout">
               {appointments.map((apt) => (
                  <motion.div 
                    key={apt._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-900 p-5 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5"
                  >
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                           <img src={apt.doctorId?.profilePhoto} className="w-14 h-14 rounded-2xl object-cover" alt={apt.doctorId?.name} />
                           <div>
                              <h3 className="font-black text-gray-900 dark:text-white leading-tight">{apt.doctorId?.name}</h3>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{apt.doctorId?.specialization}</p>
                              <div className="flex items-center gap-1.5 mt-2">
                                 <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${getStatusColor(apt.status)}`}>
                                    {apt.status}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <button className="text-gray-400"><ChevronRight size={20} /></button>
                     </div>

                     <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                           <Calendar size={14} className="text-teal-500" />
                           <span>{format(new Date(apt.appointmentDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                           <Clock size={14} className="text-teal-500" />
                           <span>{apt.timeSlot}</span>
                        </div>
                     </div>

                     <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400 italic">
                        <MapPin size={10} /> {apt.clinicId?.name}
                     </div>

                     {activeTab === 'past' && apt.status === 'completed' && !apt.isRated && (
                        <button className="w-full mt-4 bg-teal-50 dark:bg-teal-900/30 text-teal-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                           <Star size={14} fill="currentColor" /> Rate Experience
                        </button>
                     )}
                  </motion.div>
               ))}
            </AnimatePresence>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
               <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-300">
                  <AlertCircle size={40} />
               </div>
               <div>
                  <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">No {activeTab} bookings</h3>
                  <p className="text-xs font-bold text-gray-400 mt-1">Ready to book your next visit?</p>
               </div>
               <button 
                onClick={() => navigate('/search')}
                className="bg-teal-600 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-teal-500/20"
               >
                  Book Appointment
               </button>
            </div>
         )}
      </div>
    </div>
  );
};

export default Appointments;
