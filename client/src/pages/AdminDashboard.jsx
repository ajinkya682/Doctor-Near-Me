import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, Users, Building2, ShieldCheck, 
  Plus, Search, TrendingUp, MoreVertical,
  Activity, MapPin, CheckCircle2, AlertCircle
} from "lucide-react";

const STATS = [
  { label: "Monthly Bookings", value: "1,248", change: "+12%", color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-950/30" },
  { label: "Verified Doctors", value: "84", change: "+5", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { label: "Active Clinics", value: "12", change: "0", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/30" },
];

const RECENT_CLINICS = [
  { id: 1, name: "City Health Center", location: "Bandra", doctors: 12, status: "Active" },
  { id: 2, name: "Surya Multispeciality", location: "Santacruz", doctors: 8, status: "Pending Verification" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-black">
      {/* Admin Header */}
      <div className="px-6 pt-10 pb-6 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Admin Control</h1>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Global Overview</p>
            </div>
          </div>
          <button className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
            <Plus size={24} />
          </button>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          {STATS.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label} 
              className={`${stat.bg} p-6 rounded-3xl border border-white dark:border-zinc-800/50 flex justify-between items-center`}
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{stat.value}</h2>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-xs font-black ${stat.color}`}>{stat.change}</span>
                <TrendingUp size={16} className={stat.color} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Clinic Management */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Clinics</h3>
            <button className="text-primary-600 text-xs font-bold flex items-center">
              <Building2 size={14} className="mr-1" /> View All
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_CLINICS.map(clinic => (
              <div key={clinic.id} className="card-premium p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{clinic.name}</h4>
                    <p className="text-[10px] text-zinc-500 flex items-center">
                      <MapPin size={10} className="mr-1" /> {clinic.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${clinic.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {clinic.status}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-1 font-medium">{clinic.doctors} Doctors</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialty Stats */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Most Booked Specialties</h3>
          <div className="card-premium p-6 space-y-4">
            {[
              { name: "Cardiology", count: "450", color: "bg-primary-500" },
              { name: "Dermatology", count: "320", color: "bg-emerald-500" },
              { name: "Pediatrics", count: "280", color: "bg-blue-500" }
            ].map(spec => (
              <div key={spec.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-zinc-600 dark:text-zinc-400">{spec.name}</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{spec.count}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(parseInt(spec.count)/500)*100}%` }}
                    className={`h-full ${spec.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
