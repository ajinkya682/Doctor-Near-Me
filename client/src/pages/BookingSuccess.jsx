import { motion } from 'framer-motion';
import { 
  CheckCircle2, Calendar, Clock, MapPin, 
  ChevronRight, Home, Download, Share2 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../api/axios';

const BookingSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', id],
    queryFn: async () => {
      const res = await api.get(`/appointments/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col items-center p-6 pt-12">
      {/* Success Animation */}
      <motion.div 
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500 mb-6"
      >
        <CheckCircle2 size={48} strokeWidth={3} />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2 mb-10"
      >
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Booking Success!</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold px-8">Your appointment has been confirmed. We've sent the details to your WhatsApp.</p>
      </motion.div>

      {/* Ticket Card */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 dark:border-gray-800 overflow-hidden relative"
      >
        {/* Perforated Line Decoration */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white dark:bg-black rounded-full z-10" />
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-black rounded-full z-10" />

        <div className="p-8 pb-10 border-b border-dashed border-gray-200 dark:border-gray-700">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                 <p className="text-lg font-black text-gray-900 dark:text-white uppercase">#{appointment?.bookingId}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full uppercase tracking-widest">Pending</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-teal-500"><Calendar size={24} /></div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{format(new Date(appointment?.appointmentDate), 'EEEE, MMMM dd')}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-teal-500"><Clock size={24} /></div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{appointment?.timeSlot}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-8 pt-10 space-y-6">
           <div className="flex gap-4">
              <img src={appointment?.doctorId?.profilePhoto} className="w-14 h-14 rounded-2xl object-cover" alt={appointment?.doctorId?.name} />
              <div>
                 <h3 className="font-black text-gray-900 dark:text-white">{appointment?.doctorId?.name}</h3>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{appointment?.doctorId?.specialization}</p>
                 <p className="text-[10px] font-black text-teal-600 mt-1 flex items-center gap-1"><MapPin size={10} /> {appointment?.clinicId?.name}</p>
              </div>
           </div>

           <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 uppercase">Consultation Fee</span>
              <span className="text-sm font-black text-gray-900 dark:text-white">₹ {appointment?.consultationFee}</span>
           </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="w-full mt-10 space-y-4">
         <button 
          onClick={() => navigate('/')}
          className="w-full bg-teal-600 text-white py-5 rounded-[32px] font-black text-lg shadow-xl shadow-teal-500/20 flex items-center justify-center gap-3 active:scale-95 transition-transform"
         >
            <Home size={20} /> Back to Home
         </button>
         
         <div className="flex gap-4">
            <button className="flex-grow bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
               <Download size={16} /> Receipt
            </button>
            <button className="flex-grow bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2">
               <Share2 size={16} /> Share
            </button>
         </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
