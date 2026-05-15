import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, User, Settings, CheckCircle, XCircle, 
  Plus, Users, Activity, LogOut, ChevronRight, Save,
  AlertCircle, Moon, Sun, Bell
} from "lucide-react";

const TODAY_APPOINTMENTS = [
  { id: 1, patient: "John Doe", time: "09:00 AM", type: "First Visit", status: "Waiting" },
  { id: 2, patient: "Jane Smith", time: "10:30 AM", type: "Follow up", status: "Confirmed" },
  { id: 3, patient: "Robert Brown", time: "11:00 AM", type: "Consultation", status: "Confirmed" },
];

export default function DoctorDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-black">
      {/* Sidebar / Top Nav for Mobile Dashboard */}
      <div className="px-6 pt-8 pb-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold">DR</div>
            <div>
              <h1 className="text-lg font-black text-zinc-900 dark:text-zinc-100 leading-tight">Dr. Sarah Johnson</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Cardiologist</p>
            </div>
          </div>
          <button className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400">
            <Bell size={20} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl border border-primary-100 dark:border-primary-900/50">
            <div className="flex items-center justify-between mb-2">
              <Users size={16} className="text-primary-600" />
              <span className="text-[10px] font-bold text-primary-600 uppercase">Today</span>
            </div>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">12</p>
            <p className="text-[10px] text-zinc-500 font-medium">Appointments</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between mb-2">
              <Activity size={16} className="text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Status</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">{isAvailable ? 'Active' : 'Away'}</p>
              <button 
                onClick={() => setIsAvailable(!isAvailable)}
                className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isAvailable ? 'bg-emerald-500' : 'bg-zinc-300'}`}
              >
                <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isAvailable ? 'translate-x-4' : ''}`} />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium mt-1">Availability</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-6 overflow-x-auto no-scrollbar pt-2">
          {["Overview", "Slots", "Profile"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`text-xs font-bold uppercase tracking-widest pb-3 transition-all relative ${activeTab === tab.toLowerCase() ? 'text-primary-600' : 'text-zinc-400'}`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && <motion.div layoutId="dash-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Timeline</h3>
              <div className="space-y-4">
                {TODAY_APPOINTMENTS.map((app) => (
                  <div key={app.id} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-zinc-400 w-16 text-right pr-2">{app.time}</div>
                      <div className="w-0.5 h-full bg-zinc-100 dark:bg-zinc-800 relative mt-1">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-600 border-2 border-white dark:border-zinc-900" />
                      </div>
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="card-premium p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{app.patient}</h4>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${app.status === 'Waiting' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500">{app.type}</p>
                        <div className="flex space-x-2 mt-3">
                          <button className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-[10px] font-bold">Start Session</button>
                          <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-400"><XCircle size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "slots" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="card-premium p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-zinc-900 dark:text-zinc-100">Working Hours</h3>
                  <button className="text-primary-600 text-xs font-bold">+ Add Slot</button>
                </div>
                <div className="space-y-4">
                  {['Morning', 'Afternoon', 'Evening'].map(period => (
                    <div key={period} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{period}</span>
                      <div className="flex items-center space-x-2">
                        <input type="text" defaultValue="09:00 AM" className="w-20 bg-white dark:bg-zinc-700 p-1.5 rounded border border-zinc-100 dark:border-zinc-600 text-[10px] text-center" />
                        <span className="text-zinc-400">-</span>
                        <input type="text" defaultValue="12:00 PM" className="w-20 bg-white dark:bg-zinc-700 p-1.5 rounded border border-zinc-100 dark:border-zinc-600 text-[10px] text-center" />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-sm flex items-center justify-center space-x-2">
                  <Save size={18} />
                  <span>Update Slots</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
