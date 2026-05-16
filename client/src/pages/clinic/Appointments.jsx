import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Calendar, Clock, User, 
  CheckCircle2, XCircle, MoreVertical, 
  Phone, MessageSquare, AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const ClinicAppointments = () => {
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed
  const queryClient = useQueryClient();

  // 1. Fetch Appointments (Mocked data for layout, but backend ready)
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['clinic-appointments', filter],
    queryFn: async () => {
      // In a real app, this would be /appointments/clinic (which we'll need to add)
      // For now, I'll return mock data to show the high-fidelity UI
      return [
        { id: '1', bookingId: 'APT-2024-00001', patient: { name: 'Rahul Sharma', phone: '9876543210' }, doctor: 'Dr. Amit Mehta', timeSlot: '09:00 AM', status: 'pending', date: new Date() },
        { id: '2', bookingId: 'APT-2024-00002', patient: { name: 'Sonia Gandhi', phone: '9123456789' }, doctor: 'Dr. Amit Mehta', timeSlot: '10:30 AM', status: 'confirmed', date: new Date() },
        { id: '3', bookingId: 'APT-2024-00003', patient: { name: 'Vikram Seth', phone: '9000000001' }, doctor: 'Dr. Sarah Johnson', timeSlot: '11:00 AM', status: 'completed', date: new Date() },
      ];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      // API call to update status
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clinic-appointments']);
      toast.success('Status updated!');
    }
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'confirmed': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-600 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Appointment Manager</h1>
            <p className="text-sm font-bold text-gray-400">Manage your clinic's daily flow and confirmations.</p>
         </div>
         <div className="flex gap-2">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                type="text" 
                placeholder="Search patient or ID..." 
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm outline-none focus:border-teal-500 transition-all w-full md:w-64"
               />
            </div>
            <button className="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-400"><Filter size={20} /></button>
         </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
         {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(tab => (
            <button 
               key={tab}
               onClick={() => setFilter(tab)}
               className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                  filter === tab 
                  ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-500/20' 
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'
               }`}
            >
               {tab}
            </button>
         ))}
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 gap-4">
         {isLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-3xl" />)
         ) : (
            <AnimatePresence>
               {appointments.map((apt) => (
                  <motion.div 
                     key={apt.id}
                     layout
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group"
                  >
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex gap-4">
                           <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-teal-600 border border-gray-100 dark:border-gray-700">
                              <User size={28} />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                 <h3 className="font-black text-gray-900 dark:text-white">{apt.patient.name}</h3>
                                 <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusStyle(apt.status)}`}>
                                    {apt.status}
                                 </span>
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Booking ID: {apt.bookingId}</p>
                              <div className="flex items-center gap-4 mt-2">
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><Phone size={10} /> {apt.patient.phone}</div>
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><MessageSquare size={10} /> Chat</div>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Doctor</p>
                              <p className="text-sm font-black text-gray-800 dark:text-gray-200">{apt.doctor}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Scheduled For</p>
                              <div className="flex items-center gap-2 text-sm font-black text-gray-800 dark:text-gray-200">
                                 <Calendar size={14} className="text-teal-500" />
                                 <span>{format(apt.date, 'MMM dd')}</span>
                                 <Clock size={14} className="text-teal-500 ml-2" />
                                 <span>{apt.timeSlot}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50 dark:border-gray-800">
                           {apt.status === 'pending' && (
                              <>
                                 <button className="flex-grow lg:flex-none px-4 py-2 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-teal-500/20">
                                    <CheckCircle2 size={14} /> Confirm
                                 </button>
                                 <button className="flex-grow lg:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">
                                    <XCircle size={14} /> Decline
                                 </button>
                              </>
                           )}
                           {apt.status === 'confirmed' && (
                              <button className="flex-grow lg:flex-none px-4 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                 <CheckCircle2 size={14} /> Mark Arrived
                              </button>
                           )}
                           <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 border border-gray-100 dark:border-gray-700"><MoreVertical size={18} /></button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         )}
      </div>
    </div>
  );
};

export default ClinicAppointments;
