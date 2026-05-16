import { motion } from 'framer-motion';
import { DollarSign, RotateCcw, Clock, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"><ChevronLeft size={24} /></button>
        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Refund Policy</h2>
        <div className="w-10" />
      </header>

      <section className="px-6 pt-6 max-w-[480px] mx-auto space-y-10">
         <div className="space-y-4">
            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center text-orange-600 mb-6">
               <DollarSign size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Trust & Refunds</h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Updated: May 16, 2026</p>
         </div>

         <div className="space-y-8 text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            {/* Subscriptions */}
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-4">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <RotateCcw size={14} className="text-orange-500" /> Subscriptions
               </h3>
               <div className="space-y-3">
                  <div className="flex items-start gap-3">
                     <div className="w-5 h-5 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-teal-600 rounded-full" /></div>
                     <p><span className="font-black text-gray-900 dark:text-white">Full Refund:</span> Within 7 days of initial subscription.</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <div className="w-5 h-5 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-orange-600 rounded-full" /></div>
                     <p><span className="font-black text-gray-900 dark:text-white">Prorated Refund:</span> After the first 7 days, based on remaining duration.</p>
                  </div>
               </div>
            </div>

            {/* Appointments */}
            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 space-y-4">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <Clock size={14} className="text-orange-500" /> Appointments
               </h3>
               <div className="space-y-3">
                  <div className="flex items-start gap-3">
                     <div className="w-5 h-5 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-teal-600 rounded-full" /></div>
                     <p><span className="font-black text-gray-900 dark:text-white">Full Refund:</span> If cancelled at least 2 hours in advance.</p>
                  </div>
                  <div className="flex items-start gap-3">
                     <div className="w-5 h-5 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center shrink-0 mt-0.5"><div className="w-2 h-2 bg-red-600 rounded-full" /></div>
                     <p><span className="font-black text-gray-900 dark:text-white">No Refund:</span> If cancelled less than 2 hours before the slot.</p>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-[32px] border border-teal-100 dark:border-teal-800/30 flex items-center gap-4">
               <ShieldCheck size={24} className="text-teal-600 shrink-0" />
               <p className="text-xs font-bold text-teal-600 leading-tight">
                  All refunds are processed within 5-7 business days to your original payment method.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
