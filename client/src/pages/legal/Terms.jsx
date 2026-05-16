import { motion } from 'framer-motion';
import { Gavel, Scale, AlertTriangle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"><ChevronLeft size={24} /></button>
        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Terms of Service</h2>
        <div className="w-10" />
      </header>

      <section className="px-6 pt-6 max-w-[480px] mx-auto space-y-10">
         <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 mb-6">
               <Scale size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Service Agreement</h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Effective Date: May 16, 2026</p>
         </div>

         <div className="space-y-8 text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            <div className="space-y-3">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <Gavel size={14} className="text-blue-500" /> 1. Usage Terms
               </h3>
               <p>
                  By using Doctor Near Me, you agree to provide accurate information and use the platform only for lawful medical appointment bookings. Misuse of the platform may lead to immediate account suspension.
               </p>
            </div>

            <div className="space-y-3">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <AlertTriangle size={14} className="text-blue-500" /> 2. Medical Disclaimer
               </h3>
               <p>
                  Doctor Near Me is a booking facilitator, not a medical provider. We do not provide medical advice or emergency services. In case of emergency, please visit the nearest hospital immediately.
               </p>
            </div>

            <div className="space-y-3 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-800/30">
               <h3 className="font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest text-xs">Platform Fees</h3>
               <p className="text-xs font-bold text-blue-600">
                  We reserve the right to modify subscription fees or booking commissions with a 30-day notice to our clinic partners.
               </p>
            </div>

            <div className="space-y-3">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">3. Account Security</h3>
               <p>
                  You are responsible for maintaining the confidentiality of your OTP and account access. Any activity performed through your account will be deemed your responsibility.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Terms;
