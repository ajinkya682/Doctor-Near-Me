import { useState } from 'react';
import { Search, MapPin, Star, ChevronRight, Heart, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: '1', name: 'General', icon: '🩺' },
  { id: '2', name: 'Dentist', icon: '🦷' },
  { id: '3', name: 'Cardiology', icon: '❤️' },
  { id: '4', name: 'Ayurveda', icon: '🌿' },
  { id: '5', name: 'Skin', icon: '✨' },
];

const nearbyClinics = [
  { 
    id: '1', 
    name: 'City Care Clinic', 
    specialty: 'Multispecialty', 
    rating: 4.8, 
    reviews: 124, 
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: '2', 
    name: 'Smile Dental Hub', 
    specialty: 'Dental, Ortho', 
    rating: 4.9, 
    reviews: 89, 
    distance: '1.2 km',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400'
  }
];

const Home = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero / Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Welcome back,</p>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Hello, Patient! 👋</h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden"
          >
             <img src="https://ui-avatars.com/api/?name=Patient&background=0D9488&color=fff" alt="User" />
          </motion.div>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold">
          <MapPin size={18} />
          <span className="text-sm">Viman Nagar, Pune</span>
          <ChevronRight size={16} />
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search doctors, clinics..." 
            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
          />
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Specialties</h3>
          <button className="text-teal-600 dark:text-teal-400 text-sm font-bold">See All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 min-w-[72px]"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-50 dark:border-gray-800">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Nearby Clinics Carousel */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white">Clinics Near You</h3>
          <button className="text-teal-600 dark:text-teal-400 text-sm font-bold">Map View</button>
        </div>
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 px-1">
          {nearbyClinics.map((clinic) => (
            <motion.div
              key={clinic.id}
              whileHover={{ y: -5 }}
              className="min-w-[280px] bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-xl shadow-black/5 dark:shadow-none border border-gray-100 dark:border-gray-800"
            >
              <div className="relative h-40">
                <img src={clinic.image} className="w-full h-full object-cover" alt={clinic.name} />
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-teal-600">
                  <Heart size={18} />
                </div>
                <div className="absolute bottom-4 left-4 bg-teal-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                   Verified
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{clinic.name}</h4>
                  <div className="flex items-center gap-1 text-orange-400 font-black text-xs">
                    <Star size={14} fill="currentColor" />
                    <span>{clinic.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">{clinic.specialty}</p>
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-3">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{clinic.distance} away</span>
                  <button className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-xs font-black px-4 py-2 rounded-xl">
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promotions / Health Tip */}
      <section className="bg-teal-600 rounded-[32px] p-6 text-white relative overflow-hidden">
         <div className="relative z-10">
            <h3 className="text-xl font-black mb-2">Checkup Special!</h3>
            <p className="text-teal-50 text-sm opacity-90 leading-relaxed max-w-[200px]">Get 20% off on your first full body checkup.</p>
            <button className="mt-4 bg-white text-teal-600 text-xs font-black px-6 py-3 rounded-xl shadow-lg shadow-black/10">
               Claim Now
            </button>
         </div>
         <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
         <div className="absolute top-2 right-6 text-6xl opacity-20">🎁</div>
      </section>
    </div>
  );
};

export default Home;
