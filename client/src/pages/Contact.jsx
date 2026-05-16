import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, 
  CheckCircle2, Loader2, ChevronDown,
  MessageSquare, Users, Building2, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Patient Support',
    message: ''
  });

  const subjects = [
    'Patient Support',
    'Clinic Partner Inquiry',
    'Press',
    'Careers',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      toast.success('Message sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 mb-8"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Message Received!</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold max-w-xs mx-auto">
          We have received your message and will respond within 24 hours.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-10 px-8 py-4 bg-teal-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-500/20"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-20">
      {/* Header */}
      <section className="bg-teal-600 pt-20 pb-32 px-6 rounded-b-[60px] relative overflow-hidden">
         <div className="max-w-[480px] mx-auto relative z-10">
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">Get in Touch</h1>
            <p className="text-teal-50 font-bold opacity-80">Have questions? We're here to help you and your clinic grow.</p>
         </div>
         {/* Decorative elements */}
         <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
         <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-teal-400/20 rounded-full blur-2xl" />
      </section>

      {/* Contact Form */}
      <section className="px-6 -mt-16 max-w-[480px] mx-auto relative z-20">
         <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl shadow-black/10 p-8 border border-gray-100 dark:border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Your Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm transition-all dark:text-white"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email</label>
                     <input 
                       required
                       type="email" 
                       placeholder="hello@example.com"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm transition-all dark:text-white"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Phone</label>
                     <input 
                       required
                       type="tel" 
                       placeholder="+91 00000 00000"
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm transition-all dark:text-white"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Subject</label>
                  <div className="relative">
                     <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm appearance-none cursor-pointer dark:text-white"
                     >
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Message</label>
                  <textarea 
                    required
                    rows="5"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm transition-all dark:text-white"
                  />
               </div>

               <button 
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3 active:scale-95 transition-transform"
               >
                  {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Send Message</>}
               </button>
            </form>
         </div>
      </section>

      {/* Quick Contact Info */}
      <section className="px-6 py-12 space-y-6 max-w-[480px] mx-auto">
         <h3 className="font-black text-gray-900 dark:text-white text-center uppercase tracking-widest text-xs">Direct Support</h3>
         <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
               <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600"><Mail size={20} /></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">support@doctornearme.in</p>
               </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
               <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600"><Building2 size={20} /></div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Head Office</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Cyber City, Pune, Maharashtra</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Contact;
