import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Calendar, Star, 
  ArrowUpRight, ArrowDownRight, DollarSign,
  Activity, PieChart, BarChart3
} from 'lucide-react';

const ClinicAnalytics = () => {
  const stats = [
    { label: "Total Revenue", value: "₹2,45,200", change: "+12.5%", trendingUp: true, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Patients", value: "1,240", change: "+8.2%", trendingUp: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Bookings", value: "850", change: "-2.4%", trendingUp: false, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Avg Rating", value: "4.8", change: "+0.1", trendingUp: true, icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header>
         <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Business Analytics</h1>
         <p className="text-sm font-bold text-gray-400">Track your growth, revenue, and clinic performance metrics.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5">
               <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 ${stat.bg} dark:bg-gray-800 rounded-xl flex items-center justify-center ${stat.color}`}>
                     <stat.icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trendingUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                     {stat.trendingUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                     {stat.change}
                  </div>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Growth Chart (Mockup) */}
         <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 p-8 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-teal-500" /> Revenue Growth
               </h3>
               <select className="bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[10px] font-black uppercase p-2 outline-none">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
               </select>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 px-2">
               {[40, 60, 45, 90, 65, 80].map((h, i) => (
                  <div key={i} className="flex-grow flex flex-col items-center gap-3 group">
                     <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className="w-full bg-teal-500/20 group-hover:bg-teal-500 transition-colors rounded-t-xl relative"
                     >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                           ₹{(h * 1.5).toFixed(1)}K
                        </div>
                     </motion.div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Distribution */}
         <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 p-8 space-y-6">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
               <BarChart3 size={20} className="text-teal-500" /> Top Specialties
            </h3>
            <div className="space-y-4">
               {[
                  { label: "Pediatrics", value: 45, color: "bg-blue-500" },
                  { label: "Cardiology", value: 30, color: "bg-teal-500" },
                  { label: "Dermatology", value: 15, color: "bg-purple-500" },
                  { label: "Other", value: 10, color: "bg-gray-400" },
               ].map((item, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="text-gray-900 dark:text-white">{item.value}%</span>
                     </div>
                     <div className="h-3 bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${item.value}%` }}
                           className={`h-full ${item.color}`}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ClinicAnalytics;
