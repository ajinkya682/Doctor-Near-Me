import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MessageSquare, Reply, ChevronDown, 
  Filter, Calendar, User, Search, CheckCircle2 
} from 'lucide-react';
import { format } from 'date-fns';

const ClinicReviews = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, pending, replied

  const reviews = [
    { 
      id: 1, 
      patient: 'Rahul Sharma', 
      rating: 5, 
      date: new Date(), 
      comment: 'Excellent experience with Dr. Amit. He explained everything very clearly.', 
      doctor: 'Dr. Amit Mehta',
      replied: true,
      reply: 'Thank you Rahul! We are glad you had a positive experience.'
    },
    { 
      id: 2, 
      patient: 'Anjali Gupta', 
      rating: 4, 
      date: new Date(), 
      comment: 'Wait time was slightly long, but the consultation was very thorough.', 
      doctor: 'Dr. Sarah Johnson',
      replied: false 
    }
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Patient Feedback</h1>
            <p className="text-sm font-bold text-gray-400">Read and respond to your patients' experiences.</p>
         </div>
         <div className="flex bg-white dark:bg-gray-900 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
            {['all', 'pending', 'replied'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-gray-400'
                }`}
               >
                  {tab}
               </button>
            ))}
         </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
         {reviews.map((review) => (
            <motion.div 
               key={review.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 overflow-hidden"
            >
               <div className="p-8 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 font-black">
                           {review.patient.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                           <h3 className="font-black text-gray-900 dark:text-white">{review.patient}</h3>
                           <div className="flex items-center gap-2">
                              <div className="flex text-orange-400">
                                 {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= review.rating ? "currentColor" : "none"} />)}
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">● {format(review.date, 'MMM dd, yyyy')}</span>
                           </div>
                        </div>
                     </div>
                     <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Consulted With</p>
                        <p className="text-xs font-black text-gray-800 dark:text-gray-200">{review.doctor}</p>
                     </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-gray-50 dark:border-gray-700/50">
                     <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">"{review.comment}"</p>
                  </div>

                  {review.replied ? (
                     <div className="pl-8 relative">
                        <div className="absolute left-3 top-0 bottom-0 w-1 bg-teal-100 dark:bg-teal-900/30 rounded-full" />
                        <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-3xl border border-teal-100 dark:border-teal-900/20">
                           <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 size={14} className="text-teal-600" />
                              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Official Reply</span>
                           </div>
                           <p className="text-xs font-bold text-teal-900 dark:text-teal-400">{review.reply}</p>
                        </div>
                     </div>
                  ) : (
                     <div className="flex flex-col gap-3">
                        <textarea 
                           placeholder="Type your response to this patient..."
                           className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 rounded-2xl p-4 text-xs font-medium outline-none transition-all"
                           rows="3"
                        />
                        <button className="self-end px-6 py-3 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-teal-500/20">
                           <Reply size={14} /> Send Reply
                        </button>
                     </div>
                  )}
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
};

export default ClinicReviews;
