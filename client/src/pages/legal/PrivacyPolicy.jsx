import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"><ChevronLeft size={24} /></button>
        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Privacy Policy</h2>
        <div className="w-10" />
      </header>

      <section className="px-6 pt-6 max-w-[480px] mx-auto space-y-10">
         <div className="space-y-4">
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-3xl flex items-center justify-center text-teal-600 mb-6">
               <Shield size={32} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">Your Privacy is Our Priority</h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Last Updated: May 16, 2026</p>
         </div>

         <div className="space-y-8 text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
            <div className="space-y-3">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <Lock size={14} className="text-teal-500" /> 1. Data Collection
               </h3>
               <p>
                  We collect information necessary to provide medical booking services, including your name, phone number, and medical preferences. For clinics, we collect professional registration details.
               </p>
            </div>

            <div className="space-y-3">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <Eye size={14} className="text-teal-500" /> 2. Information Usage
               </h3>
               <p>
                  Your data is used solely to facilitate appointments, send reminders, and improve our services. We strictly follow the IT Act 2000 and Digital Health guidelines of India.
               </p>
            </div>

            <div className="space-y-3 p-6 bg-teal-50 dark:bg-teal-900/10 rounded-[32px] border border-teal-100 dark:border-teal-800/30">
               <h3 className="font-black text-teal-700 dark:text-teal-400 uppercase tracking-widest text-xs">Medical Confidentiality</h3>
               <p className="text-xs font-bold text-teal-600">
                  We do not sell or share your personal health information with third-party advertisers. All medical records and booking histories are encrypted at rest.
               </p>
            </div>

            <div className="space-y-3">
               <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs flex items-center gap-2">
                  <FileText size={14} className="text-teal-500" /> 3. Data Rights
               </h3>
               <p>
                  You have the right to request deletion of your account and all associated data at any time through our Support center or the "Delete Account" feature in your profile.
               </p>
            </div>
         </div>

         <div className="pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Questions about privacy?</p>
            <button 
              onClick={() => navigate('/contact')}
              className="text-teal-600 font-black text-xs uppercase tracking-widest mt-2 hover:underline"
            >
               Contact Support Team
            </button>
         </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
