import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, Phone, Mail, 
  Image as ImageIcon, Plus, Trash2, Save,
  CheckCircle2, Clock, Globe, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/useStore';

const ClinicProfile = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('basic'); // basic, photos, hours

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Clinic Settings</h1>
            <p className="text-sm font-bold text-gray-400">Update your clinic's public profile and operational settings.</p>
         </div>
         <button className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-teal-500/20 active:scale-95 transition-transform">
            <Save size={18} /> Save Changes
         </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Tabs */}
         <div className="lg:col-span-1 space-y-2">
            {[
               { id: 'basic', label: 'Basic Info', icon: Building2 },
               { id: 'photos', label: 'Gallery', icon: ImageIcon },
               { id: 'hours', label: 'Business Hours', icon: Clock },
               { id: 'security', label: 'Security', icon: ShieldCheck },
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                     activeTab === tab.id 
                     ? 'bg-white dark:bg-gray-900 text-teal-600 shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-800' 
                     : 'text-gray-400 hover:text-gray-600'
                  }`}
               >
                  <tab.icon size={18} /> {tab.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <motion.div 
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 p-8"
            >
               {activeTab === 'basic' && (
                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Clinic Name</label>
                           <input type="text" defaultValue="City Care Clinic" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                           <input type="email" defaultValue="contact@citycare.com" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white" />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Full Address</label>
                        <textarea rows="3" defaultValue="123, Health Street, Near Medical College, Pune, Maharashtra - 411001" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white" />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">About Clinic</label>
                        <textarea rows="4" className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-teal-500 p-4 rounded-2xl outline-none font-bold text-sm text-gray-900 dark:text-white" placeholder="Describe your clinic services..." />
                     </div>
                  </div>
               )}

               {activeTab === 'photos' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="group relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
                              <img src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&h=300&q=80`} className="w-full h-full object-cover" alt="Clinic" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <button className="w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg"><Trash2 size={18} /></button>
                              </div>
                           </div>
                        ))}
                        <button className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-500 transition-all">
                           <Plus size={32} />
                           <span className="text-[10px] font-black uppercase mt-2 tracking-widest">Add Photo</span>
                        </button>
                     </div>
                     <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex gap-3 text-blue-600 border border-blue-100 dark:border-blue-900/20">
                        <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold leading-relaxed">Tip: Upload high-quality photos of your clinic's exterior, interior, and staff to build trust with patients.</p>
                     </div>
                  </div>
               )}

               {activeTab === 'hours' && (
                  <div className="space-y-6">
                     {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <div key={day} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                           <span className="text-sm font-black text-gray-700 dark:text-gray-300 w-24">{day}</span>
                           <div className="flex items-center gap-4">
                              <input type="time" defaultValue="09:00" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl text-xs font-bold" />
                              <span className="text-gray-400 text-xs font-bold">to</span>
                              <input type="time" defaultValue="18:00" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-xl text-xs font-bold" />
                              <div className="w-12 h-6 bg-teal-600 rounded-full p-1 cursor-pointer">
                                 <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </motion.div>
         </div>
      </div>
    </div>
  );
};

export default ClinicProfile;
