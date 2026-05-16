import { useState } from 'react';
import { Search, MapPin, Filter, Star, List, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
  const [view, setView] = useState('list'); // 'list' or 'map'

  const clinics = [
    { 
      id: '1', 
      name: 'City Care Clinic', 
      address: 'Viman Nagar, Pune',
      specialties: ['General', 'Cardiology'],
      rating: 4.8, 
      reviews: 124, 
      distance: '0.8 km',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400'
    },
    { 
      id: '2', 
      name: 'Smile Dental Hub', 
      address: 'Kalyani Nagar, Pune',
      specialties: ['Dental', 'Ortho'],
      rating: 4.9, 
      reviews: 89, 
      distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400'
    },
    { 
      id: '3', 
      name: 'Ayush Ayurvedic Center', 
      address: 'Koregaon Park, Pune',
      specialties: ['Ayurveda'],
      rating: 4.7, 
      reviews: 56, 
      distance: '2.5 km',
      image: 'https://images.unsplash.com/photo-1631815541542-e8929e71ecba?auto=format&fit=crop&q=80&w=400'
    }
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Search & Filter */}
      <section className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by clinic or specialty..." 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
            />
          </div>
          <button className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center border border-teal-100 dark:border-teal-900/50">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Nearby', 'Top Rated', 'Open Now', 'Dentist', 'Cardiology'].map((filter) => (
            <button key={filter} className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs font-bold text-gray-600 dark:text-gray-400 hover:border-teal-500 hover:text-teal-600 transition-colors">
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* View Toggle & Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{clinics.length} clinics found</p>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-gray-400'}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setView('map')}
            className={`p-2 rounded-lg transition-all ${view === 'map' ? 'bg-white dark:bg-gray-700 shadow-sm text-teal-600 dark:text-teal-400' : 'text-gray-400'}`}
          >
            <MapIcon size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {clinics.map((clinic) => (
                <motion.div 
                  key={clinic.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 flex shadow-sm group"
                >
                  <div className="w-32 h-32 relative overflow-hidden">
                    <img src={clinic.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={clinic.name} />
                  </div>
                  <div className="flex-grow p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{clinic.name}</h4>
                        <div className="flex items-center gap-1 text-orange-400 font-bold text-xs">
                          <Star size={12} fill="currentColor" />
                          <span>{clinic.rating}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {clinic.address}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex gap-1">
                         {clinic.specialties.map(s => (
                           <span key={s} className="text-[9px] bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                             {s}
                           </span>
                         ))}
                       </div>
                       <span className="text-[11px] font-black text-teal-600 dark:text-teal-400">{clinic.distance}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-[32px] flex items-center justify-center relative overflow-hidden"
            >
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i2368!3i1578!2m3!1e0!2sm!3i624119934!3m8!2sen!3sin!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] bg-cover" />
               </div>
               <div className="z-10 text-center">
                  <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <MapPin size={32} />
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">Map View Enabled</p>
                  <p className="text-xs text-gray-500">Google Maps Integration Placeholder</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchPage;
