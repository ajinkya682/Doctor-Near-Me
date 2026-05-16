import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, ChevronLeft, SlidersHorizontal, MapPin, 
  Star, List, Map as MapIcon, X, Check, Navigation, 
  Stethoscope, Building2, Tag, AlertCircle, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [view, setView] = useState('list');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [locationStatus, setLocationStatus] = useState('requesting'); // requesting, granted, denied
  const [selectedClinic, setSelectedClinic] = useState(null); // For map preview

  const clinics = [
    { 
      id: '1', name: 'City Care Clinic', address: 'Viman Nagar, Pune', 
      specialties: ['General', 'Cardiology'], rating: 4.8, distance: '0.8 km', 
      isOpen: true, image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400',
      doctors: [{ name: 'Dr. Sharma', spec: 'Cardiology' }, { name: 'Dr. Mehta', spec: 'General' }]
    },
    { 
      id: '2', name: 'Smile Dental Hub', address: 'Kalyani Nagar, Pune', 
      specialties: ['Dental', 'Ortho'], rating: 4.9, distance: '1.2 km', 
      isOpen: false, image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400',
      doctors: [{ name: 'Dr. Rahul', spec: 'Dentist' }]
    }
  ];

  useEffect(() => {
    // Focus search input on load
    if (searchInputRef.current) searchInputRef.current.focus();

    // Request location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationStatus('granted'),
        () => setLocationStatus('denied')
      );
    }
  }, []);

  const handleSearchChange = (val) => {
    setQuery(val);
    setShowAutocomplete(val.length > 0);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black overflow-hidden">
      
      {/* Header */}
      <header className="p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              ref={searchInputRef}
              type="text" 
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search doctors, clinics..." 
              className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none dark:text-white focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <button 
            onClick={() => setShowFilters(true)}
            className="p-3 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-2xl border border-teal-100 dark:border-teal-900/50"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Location Denied Banner */}
      {locationStatus === 'denied' && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-4">
           <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-red-600" size={20} />
           </div>
           <p className="text-xs font-bold text-red-700 dark:text-red-400">
             Location access is needed to find nearby clinics. Please enable location in your browser settings.
           </p>
        </div>
      )}

      {/* Results & Toggles */}
      <div className="flex-grow relative overflow-hidden flex flex-col">
        <div className="p-4 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md z-40">
           <p className="text-sm font-black text-gray-500 dark:text-gray-400">{clinics.length} clinics found near you</p>
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

        {/* List View */}
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-grow overflow-y-auto px-4 pb-24 space-y-6"
            >
              {clinics.map(clinic => (
                <div key={clinic.id} className="space-y-3">
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/clinics/${clinic.id}`)}
                    className="bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 flex h-32"
                  >
                    <div className="w-32 relative overflow-hidden">
                       <img src={clinic.image} className="w-full h-full object-cover" alt={clinic.name} />
                       {clinic.isOpen ? (
                         <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Open</div>
                       ) : (
                         <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Closed</div>
                       )}
                    </div>
                    <div className="flex-grow p-4 flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start">
                             <h4 className="font-black text-gray-900 dark:text-white leading-tight">{clinic.name}</h4>
                             <div className="flex items-center gap-0.5 text-orange-400 font-black text-xs">
                                <Star size={12} fill="currentColor" /> {clinic.rating}
                             </div>
                          </div>
                          <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 mt-1">
                             <MapPin size={10} /> {clinic.distance} away • {clinic.address}
                          </p>
                       </div>
                       <button className="self-end bg-teal-600 text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase">View</button>
                    </div>
                  </motion.div>
                  {/* Doctor Chips */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pl-4">
                    {clinic.doctors.map((doc, idx) => (
                      <span key={idx} className="whitespace-nowrap text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                        {doc.name} ({doc.spec})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-grow relative bg-gray-100 dark:bg-gray-900"
            >
               {/* Map Placeholder */}
               <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=18.5679,73.9144&zoom=14&size=600x1200&scale=2&key=YOUR_KEY')] bg-cover opacity-30 pointer-events-none" />
               
               {/* Custom Marker Placeholder */}
               <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-10 h-10 bg-teal-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-black cursor-pointer"
                onClick={() => setSelectedClinic(clinics[0])}
               >
                 1
               </motion.div>

               <button className="absolute bottom-6 right-6 w-14 h-14 bg-white dark:bg-gray-800 text-teal-600 rounded-full shadow-2xl flex items-center justify-center border border-gray-100 dark:border-gray-700">
                  <Navigation size={24} />
               </button>

               {/* Map Preview Sheet */}
               <AnimatePresence>
                 {selectedClinic && (
                   <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="absolute bottom-24 left-4 right-4 bg-white dark:bg-gray-900 rounded-[32px] p-4 shadow-2xl flex items-center gap-4 z-50 border border-gray-100 dark:border-gray-800"
                   >
                     <img src={selectedClinic.image} className="w-20 h-20 rounded-2xl object-cover" alt="Clinic" />
                     <div className="flex-grow">
                        <h4 className="font-black text-gray-900 dark:text-white leading-tight">{selectedClinic.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <div className="flex items-center gap-0.5 text-orange-400 font-black text-xs">
                              <Star size={12} fill="currentColor" /> {selectedClinic.rating}
                           </div>
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedClinic.distance}</span>
                        </div>
                        <button onClick={() => navigate(`/clinics/${selectedClinic.id}`)} className="mt-3 text-teal-600 font-black text-xs flex items-center gap-1">
                          View Details <ChevronRight size={14} />
                        </button>
                     </div>
                     <button onClick={() => setSelectedClinic(null)} className="absolute top-3 right-3 text-gray-400"><X size={18} /></button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Autocomplete Overlay */}
      <AnimatePresence>
        {showAutocomplete && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-4 right-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-50 border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {[
              { type: 'Specialty', name: 'Cardiology', icon: Tag },
              { type: 'Doctor', name: 'Dr. Priya Sharma', icon: Stethoscope },
              { type: 'Clinic', name: 'City Care Clinic', icon: Building2 },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 text-left border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors">
                 <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-teal-600"><item.icon size={20} /></div>
                 <div>
                    <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.type}</p>
                 </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Bottom Sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-950 rounded-t-[40px] z-[101] p-8 max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8" />
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white">Filters</h3>
                 <button className="text-teal-600 font-bold text-sm">Reset</button>
              </div>

              <div className="space-y-8">
                <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4 block">Specialty</label>
                   <select className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 font-bold outline-none appearance-none">
                      <option>All Specialties</option>
                      <option>Cardiology</option>
                      <option>Dental</option>
                   </select>
                </div>

                <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4 block">Distance (within 5km)</label>
                   <input type="range" min="1" max="20" className="w-full accent-teal-600" />
                   <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                      <span>1 KM</span>
                      <span>20 KM</span>
                   </div>
                </div>

                <div>
                   <label className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4 block">Minimum Rating</label>
                   <div className="flex gap-2">
                      {['Any', '3.5+', '4.0+', '4.5+'].map(r => (
                        <button key={r} className="flex-grow py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 font-bold text-xs hover:border-teal-500 hover:text-teal-600 transition-all">
                          {r}
                        </button>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-teal-500/20 active:scale-95 transition-all mt-4"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SearchPage;
