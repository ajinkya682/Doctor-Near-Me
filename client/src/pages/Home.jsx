import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Star, ChevronRight, Mic, Calendar, 
  Map as MapIcon, MessageCircle, Clock, ExternalLink,
  Heart, Navigation, MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useStore';

const categories = [
  { id: '1', name: 'Cardiology', icon: '🫀' },
  { id: '2', name: 'Dentist', icon: '🦷' },
  { id: '3', name: 'Neurology', icon: '🧠' },
  { id: '4', name: 'Orthopedic', icon: '🦴' },
  { id: '5', name: 'Eye', icon: '👁' },
  { id: '6', name: 'General', icon: '🩺' },
  { id: '7', name: 'Pediatric', icon: '👶' },
  { id: '8', name: 'Dermatology', icon: '🧴' },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState('');
  const [hasLocation, setHasLocation] = useState(false);
  const [upcomingAppointment, setUpcomingAppointment] = useState({
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    clinicName: 'City Care Clinic',
    time: '10:30 AM',
    date: '18 May 2026',
    doctorPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Section 1: Personalized Header */}
      <section className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
            {greeting}, {user?.name || 'Patient'} 👋
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
            {format(new Date(), 'EEEE, dd MMMM')}
          </p>
        </div>
        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-full border-2 border-teal-500 p-0.5 cursor-pointer overflow-hidden shadow-lg shadow-teal-500/10"
        >
          <img 
            src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name || 'P'}&background=0D9488&color=fff`} 
            className="w-full h-full rounded-full object-cover"
            alt="Profile" 
          />
        </motion.div>
      </section>

      {/* Section 2: Search Bar */}
      <section onClick={() => navigate('/search')} className="cursor-pointer">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <div className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-full py-4 pl-14 pr-14 text-sm font-medium text-gray-400 shadow-xl shadow-black/5 flex items-center">
             Search doctors, clinics, specialties...
          </div>
          <Mic className="absolute right-5 top-1/2 -translate-y-1/2 text-teal-600" size={20} />
        </div>
      </section>

      {/* Section 3: Quick Action Chips */}
      <section>
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/search?specialty=${cat.name}`)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 py-3 rounded-full shadow-sm whitespace-nowrap"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Section 4: Upcoming Appointment */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Upcoming Appointment</h3>
          <button className="text-teal-600 dark:text-teal-400 text-sm font-bold flex items-center gap-1">
            View all <ChevronRight size={16} />
          </button>
        </div>

        {upcomingAppointment ? (
          <div className="relative bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden shadow-2xl shadow-black/5 border border-gray-100 dark:border-gray-800 flex flex-col">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 to-teal-500" />
            <div className="p-5 flex gap-4">
              <img src={upcomingAppointment.doctorPhoto} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="Doctor" />
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white leading-tight">{upcomingAppointment.doctorName}</h4>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">{upcomingAppointment.specialty}</p>
                  </div>
                  <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase">Confirmed</span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl">
                    <Calendar size={14} className="text-teal-600" />
                    <span>{upcomingAppointment.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl">
                    <Clock size={14} className="text-teal-600" />
                    <span>{upcomingAppointment.time}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 flex gap-3 border-t border-gray-100 dark:border-gray-800">
              <button className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black text-gray-700 dark:text-gray-300">
                <Navigation size={14} className="text-teal-600" /> Directions
              </button>
              <button className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black text-gray-700 dark:text-gray-300">
                Reschedule
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-[32px] p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm">📅</div>
            <p className="font-bold text-gray-900 dark:text-white">No upcoming appointments</p>
            <p className="text-xs text-gray-500 mb-6">Book your first appointment today!</p>
            <button className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black text-sm">Book Now</button>
          </div>
        )}
      </section>

      {/* Section 5: Nearby Clinics */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Clinics Near You</h3>
          <button className="text-teal-600 dark:text-teal-400 text-sm font-bold underline">See all</button>
        </div>

        {!hasLocation ? (
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-[32px] p-8 text-center border border-teal-100 dark:border-teal-900/50">
             <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                <MapPin size={28} />
             </div>
             <p className="font-black text-gray-900 dark:text-white mb-2">Enable location services</p>
             <p className="text-xs text-teal-700/70 dark:text-teal-400/70 mb-6 px-4">Help us find the best medical clinics within 5km of your current location.</p>
             <button 
              onClick={() => setHasLocation(true)}
              className="bg-teal-600 text-white px-10 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
             >
                Enable Location
             </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {[1, 2].map(i => (
              <motion.div 
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/clinics/123')}
                className="min-w-[220px] bg-white dark:bg-gray-800 rounded-[28px] overflow-hidden shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-800"
              >
                <div className="h-28 relative">
                   <img src={`https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=300`} className="w-full h-full object-cover" alt="Clinic" />
                   <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-black text-teal-600">
                      <Star size={12} fill="currentColor" /> 4.8
                   </div>
                </div>
                <div className="p-4">
                  <h4 className="font-black text-sm text-gray-900 dark:text-white truncate">City Care Clinic</h4>
                  <div className="flex gap-1 mt-2">
                     <span className="text-[9px] bg-gray-50 dark:bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full font-bold uppercase">Dental</span>
                     <span className="text-[9px] bg-gray-50 dark:bg-gray-900 text-gray-400 px-2 py-0.5 rounded-full font-bold uppercase">Skin</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-teal-600 dark:text-teal-400">
                     <span className="text-[10px] font-black uppercase tracking-widest">0.8 KM AWAY</span>
                     <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Section 6: Top Rated Doctors */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Top Rated Doctors Near You</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-[28px] p-4 flex gap-4 border border-gray-50 dark:border-gray-800 shadow-sm">
               <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="Doc" />
               <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <h4 className="font-black text-gray-900 dark:text-white">Dr. Sarah Johnson</h4>
                      <div className="flex items-center gap-0.5 text-orange-400 font-black text-[10px]">
                        <Star size={10} fill="currentColor" /> 4.9
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Gynecologist • 12Y Exp</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                     <span className="text-sm font-black text-gray-900 dark:text-white">₹ 800 <span className="text-[10px] text-gray-400 font-medium">/visit</span></span>
                     <button 
                      onClick={() => navigate('/doctors/123')}
                      className="bg-teal-600 text-white px-6 py-1.5 rounded-full text-xs font-black shadow-lg shadow-teal-500/20 active:scale-95"
                     >
                        Book
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 7: WhatsApp Bot Promo */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[32px] p-6 text-white flex items-center justify-between shadow-xl shadow-green-500/20">
         <div className="flex gap-4 items-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
               <MessageCircle size={32} />
            </div>
            <div>
               <h3 className="text-lg font-black leading-tight">Book via WhatsApp</h3>
               <p className="text-green-50 text-xs font-medium opacity-90">No app needed! Send 'Hi' to our bot</p>
            </div>
         </div>
         <a 
          href="https://wa.me/910000000000?text=Hi" 
          target="_blank" 
          rel="noreferrer"
          className="bg-white text-green-600 px-5 py-3 rounded-2xl font-black text-xs shadow-lg flex items-center gap-2 active:scale-95 transition-all"
         >
            Start Chat <ExternalLink size={14} />
         </a>
      </section>
    </div>
  );
};

export default Home;
