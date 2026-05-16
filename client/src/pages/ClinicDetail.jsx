import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Phone, Navigation, Share2, Bookmark, 
  Star, MapPin, Clock, ChevronRight, Info, ShieldCheck, Loader2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useStore';

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [activeSpecialty, setActiveSpecialty] = useState('All');
  const { savedClinics, toggleSavedClinic } = useAuthStore();

  // Fetch Real Clinic Data
  const { data: clinic, isLoading } = useQuery({
    queryKey: ['clinic', id],
    queryFn: async () => {
      const res = await api.get(`/clinics/${id}`);
      return res.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
           <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Clinic...</p>
        </div>
      </div>
    );
  }

  if (!clinic) return <div className="min-h-screen flex items-center justify-center">Clinic not found</div>;

  const isSaved = savedClinics?.includes(clinic._id);
  const images = clinic.images?.length > 0 ? clinic.images : [clinic.coverImage];

  const getInitialsColor = (name) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500'];
    let hash = 0;
    for (let i = 0; i < (name?.length || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const amenityIcons = {
    'Parking': '🅿️', 'AC': '❄️', 'Wheelchair': '♿', 'Lab': '🧪', 'Pharmacy': '💊'
  };

  const filteredDoctors = activeSpecialty === 'All' 
    ? clinic.doctors 
    : clinic.doctors?.filter(d => d.specialization === activeSpecialty);

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-24">
      
      {/* Hero Section: Image Carousel */}
      <section className="relative h-64 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={images[activeImage]} 
            className="w-full h-full object-cover" 
            alt={clinic.name} 
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
        
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><ChevronLeft size={24} /></button>

        <div className="absolute bottom-6 left-6 right-6">
           <h1 className="text-3xl font-black text-white leading-tight">{clinic.name}</h1>
           <p className="text-white/80 text-xs font-medium mt-1 flex items-center gap-1">
              <MapPin size={12} /> {clinic.address}
           </p>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-1.5">
           {images.map((_, i) => (
             <button key={i} onClick={() => setActiveImage(i)} className={`h-1.5 rounded-full transition-all ${activeImage === i ? 'w-6 bg-teal-500' : 'w-1.5 bg-white/40'}`} />
           ))}
        </div>
      </section>

      {/* Action Row */}
      <section className="px-6 -mt-6 relative z-10">
         <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4 flex justify-between border border-gray-100 dark:border-gray-800">
            <a href={`tel:${clinic.phone}`} className="flex flex-col items-center gap-1.5 px-3">
               <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600"><Phone size={20} /></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Call</span>
            </a>
            <button className="flex flex-col items-center gap-1.5 px-3">
               <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600"><Navigation size={20} /></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Route</span>
            </button>
            <button onClick={() => navigator.share({ title: clinic.name, url: window.location.href })} className="flex flex-col items-center gap-1.5 px-3">
               <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600"><Share2 size={20} /></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Share</span>
            </button>
            <button onClick={() => toggleSavedClinic(clinic._id)} className="flex flex-col items-center gap-1.5 px-3">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSaved ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                  <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
               </div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Save</span>
            </button>
         </div>
      </section>

      {/* Info Section */}
      <section className="p-6 space-y-5">
         <div>
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-black text-lg text-gray-900 dark:text-white">About Clinic</h3>
               <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest">Open Now</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{clinic.description}</p>
         </div>

         <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
               <Clock size={16} className="text-teal-500" />
               <span>9:00 AM – 9:00 PM (Daily)</span>
            </div>
            <div className="flex flex-wrap gap-2">
               {clinic.specialties?.map(spec => (
                 <span key={spec} className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 text-[10px] font-black rounded-full uppercase">{spec}</span>
               ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
               {clinic.amenities?.map(item => (
                 <div key={item} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-xs">{amenityIcons[item] || '✨'}</span>
                    <span className="text-[10px] font-black text-gray-500 uppercase">{item}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Doctors Section */}
      <section className="p-6 space-y-6 bg-gray-50/50 dark:bg-gray-900/20 border-y border-gray-100 dark:border-gray-800">
         <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Our Doctors</h3>
            <span className="text-xs font-bold text-gray-400">{clinic.doctors?.length} Available</span>
         </div>

         {/* Specialty Filter */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['All', ...new Set(clinic.doctors?.map(d => d.specialization))].map(spec => (
               <button 
                key={spec}
                onClick={() => setActiveSpecialty(spec)}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap ${activeSpecialty === spec ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-800'}`}
               >
                  {spec}
               </button>
            ))}
         </div>

         <div className="space-y-4">
            {filteredDoctors?.map((doc) => (
               <div key={doc._id} className="bg-white dark:bg-gray-900 p-5 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5">
                  <div className="flex gap-4 mb-4">
                     <img src={doc.profilePhoto} className="w-16 h-16 rounded-2xl object-cover" alt={doc.name} />
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white">{doc.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{doc.specialization}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                           <div className="flex items-center gap-1 text-[10px] font-black text-orange-400"><Star size={10} fill="currentColor" /> {doc.averageRating}</div>
                           <span className="text-[10px] font-bold text-gray-400 underline">{doc.experience}Y Experience</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Consultation Fee</span>
                        <span className="font-black text-gray-900 dark:text-white">₹ {doc.consultationFee}</span>
                     </div>
                     <button 
                      onClick={() => navigate(`/doctors/${doc._id}`)}
                      className="bg-teal-600 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-teal-500/20 active:scale-95 transition-transform"
                     >
                        Book Appointment
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Reviews Section */}
      <section className="p-6 space-y-8">
         <h3 className="font-black text-lg text-gray-900 dark:text-white">Patient Reviews</h3>
         
         {/* Rating Summary Card */}
         <div className="flex gap-6 items-center">
            <div className="text-center">
               <h2 className="text-5xl font-black text-gray-900 dark:text-white">{clinic.rating || '4.7'}</h2>
               <div className="flex items-center justify-center gap-0.5 text-orange-400 my-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill={s <= (clinic.rating || 4) ? "currentColor" : "none"} />)}
               </div>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{clinic.totalReviews || 0} Reviews</p>
            </div>
            
            <div className="flex-grow space-y-1.5">
               {[5, 4, 3, 2, 1].map(star => (
                 <div key={star} className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 w-2">{star}</span>
                    <div className="flex-grow h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${star === 5 ? 85 : star === 4 ? 60 : 10}%` }}
                        className="h-full bg-teal-500 rounded-full" 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Review Cards */}
         <div className="space-y-6 pt-4">
            {clinic.reviews?.map((review) => (
               <div key={review._id} className="space-y-3">
                  <div className="flex justify-between items-start">
                     <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black ${getInitialsColor(review.userName || 'U')}`}>
                           {(review.userName || 'U').charAt(0)}
                        </div>
                        <div>
                           <h5 className="font-black text-sm text-gray-900 dark:text-white leading-none mb-1">{review.userName || 'Verified User'}</h5>
                           <div className="flex items-center gap-2">
                              <div className="flex text-orange-400">
                                 {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < review.overallRating ? "currentColor" : "none"} />)}
                              </div>
                              <span className="text-[10px] font-bold text-gray-400">Recent</span>
                           </div>
                        </div>
                     </div>
                     <button className="text-[10px] font-black text-teal-600 uppercase tracking-widest border border-teal-600/20 px-3 py-1 rounded-lg">Helpful</button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed pl-1">{review.comment}</p>
                  
                  {review.reply && (
                     <div className="ml-6 mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-l-4 border-teal-500">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-5 h-5 bg-teal-600 rounded-lg flex items-center justify-center text-[10px] text-white">🏥</div>
                           <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Clinic Response</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{review.reply}</p>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default ClinicDetail;
