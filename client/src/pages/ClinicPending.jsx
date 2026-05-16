import { Hourglass, Headset } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ClinicPending = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] p-10 text-center shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
           <Hourglass className="text-orange-600 animate-pulse" size={48} />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Account Under Review</h2>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
          Our team is reviewing your documents and will approve your account within **24-48 hours**. 
          You will receive an email once your account is fully approved and active.
        </p>

        <div className="space-y-4">
          <Link 
            to="/clinic/login"
            className="block w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-black/10"
          >
            Back to Login
          </Link>
          
          <button className="flex items-center justify-center gap-2 w-full text-teal-600 font-bold hover:underline">
            <Headset size={18} />
            Contact Support
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800">
           <p className="text-xs text-gray-400 font-medium">
             Need immediate assistance? Email us at <span className="text-teal-600 font-bold">partners@clinicbook.com</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ClinicPending;
