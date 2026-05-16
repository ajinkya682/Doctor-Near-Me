import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, 
  CheckCircle2, Info, Loader2, AlertCircle 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, addDays, isSameDay } from 'date-fns';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');

  // 1. Fetch Doctor Info (for fees, name, etc)
  const { data: doctor } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`);
      return res.data;
    }
  });

  // 2. Fetch Available Slots for selected date
  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', id, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}/availability`, {
        params: { date: format(selectedDate, 'yyyy-MM-dd') }
      });
      return res.data;
    },
    enabled: !!id
  });

  // 3. Booking Mutation
  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const res = await api.post('/appointments', bookingData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Appointment booked successfully!');
      navigate(`/booking-success/${data.appointment._id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Booking failed. Try another slot.');
    }
  });

  const handleBook = () => {
    if (!selectedSlot) return;
    bookingMutation.mutate({
      doctorId: id,
      clinicId: doctor.clinicId._id,
      appointmentDate: selectedDate,
      timeSlot: selectedSlot,
      consultationFee: doctor.consultationFee,
      patientNotes: notes,
      type: 'firstVisit'
    });
  };

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-32">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"><ChevronLeft size={24} /></button>
        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Book Appointment</h2>
        <div className="w-10" />
      </header>

      {/* Date Selection */}
      <section className="p-6 space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="font-black text-lg text-gray-900 dark:text-white">Select Date</h3>
           <span className="text-xs font-bold text-teal-600">{format(selectedDate, 'MMMM yyyy')}</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
           {dates.map((date, i) => {
             const isSelected = isSameDay(date, selectedDate);
             return (
               <button 
                key={i}
                onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                className={`flex flex-col items-center justify-center min-w-[70px] h-24 rounded-3xl transition-all border-2 ${
                  isSelected 
                  ? 'bg-teal-600 border-teal-600 text-white shadow-xl shadow-teal-500/20 scale-105' 
                  : 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-500'
                }`}
               >
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{format(date, 'EEE')}</span>
                 <span className="text-xl font-black mt-1">{format(date, 'dd')}</span>
               </button>
             );
           })}
        </div>
      </section>

      {/* Time Slots */}
      <section className="p-6 space-y-6">
        <div className="flex items-center justify-between">
           <h3 className="font-black text-lg text-gray-900 dark:text-white">Available Slots</h3>
           <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
              <Clock size={14} /> 20 min intervals
           </div>
        </div>

        {loadingSlots ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
             <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Checking slots...</p>
          </div>
        ) : (
          <div className="space-y-8">
             {/* Morning */}
             {slots?.morning.length > 0 && (
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> Morning
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                     {slots.morning.map(slot => (
                       <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                          selectedSlot === slot 
                          ? 'bg-teal-50 border-teal-600 text-teal-600' 
                          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                       >
                         {slot}
                       </button>
                     ))}
                  </div>
               </div>
             )}

             {/* Afternoon */}
             {slots?.afternoon.length > 0 && (
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" /> Afternoon
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                     {slots.afternoon.map(slot => (
                       <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                          selectedSlot === slot 
                          ? 'bg-teal-50 border-teal-600 text-teal-600' 
                          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                       >
                         {slot}
                       </button>
                     ))}
                  </div>
               </div>
             )}

             {/* Evening */}
             {slots?.evening.length > 0 && (
               <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> Evening
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                     {slots.evening.map(slot => (
                       <button 
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                          selectedSlot === slot 
                          ? 'bg-teal-50 border-teal-600 text-teal-600' 
                          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                       >
                         {slot}
                       </button>
                     ))}
                  </div>
               </div>
             )}

             {slots?.morning.length === 0 && slots?.afternoon.length === 0 && slots?.evening.length === 0 && (
               <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-[32px] text-center border border-orange-100 dark:border-orange-800/30">
                  <AlertCircle className="mx-auto text-orange-500 mb-2" size={24} />
                  <p className="text-sm font-black text-orange-900 dark:text-orange-400">No slots available</p>
                  <p className="text-xs font-bold text-orange-600 mt-1">Please try another date</p>
               </div>
             )}
          </div>
        )}
      </section>

      {/* Patient Notes */}
      <section className="p-6">
         <h3 className="font-black text-lg text-gray-900 dark:text-white mb-4 text-center underline decoration-teal-500/30">Additional Notes</h3>
         <textarea 
          placeholder="Briefly describe your symptoms (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-teal-500 rounded-3xl p-5 text-sm font-medium outline-none transition-all dark:text-white min-h-[120px]"
         />
      </section>

      {/* Sticky Booking Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 z-30">
         <div className="max-w-[480px] mx-auto space-y-4">
            <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-2xl flex items-center justify-between border border-teal-100 dark:border-teal-800/30">
               <div>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Total Fees</p>
                  <p className="text-xl font-black text-teal-700 dark:text-teal-400">₹ {doctor?.consultationFee}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Selected Slot</p>
                  <p className="text-sm font-black text-teal-700 dark:text-teal-400">{selectedSlot || '--:--'}</p>
               </div>
            </div>
            
            <button 
              onClick={handleBook}
              disabled={!selectedSlot || bookingMutation.isLoading}
              className={`w-full py-5 rounded-3xl font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${
                selectedSlot && !bookingMutation.isLoading
                ? 'bg-teal-600 text-white shadow-teal-500/30 active:scale-95' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
               {bookingMutation.isLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Confirm Booking</>}
            </button>
         </div>
      </div>
    </div>
  );
};

export default Booking;
