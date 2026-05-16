import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Phone, Navigation, Share2, Bookmark, 
  Star, MapPin, Clock, ChevronRight, Info, ShieldCheck
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
           <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
           <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Clinic...</p>
        </div>
      </div>
    );
  }

  if (!clinic) return <div>Clinic not found</div>;

  const images = clinic.images?.length > 0 ? clinic.images : [clinic.coverImage, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: clinic.name,
        url: window.location.href
      });
    } catch (err) {
      toast.success('Link copied to clipboard!');
    }
  };

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
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
           <div className="flex items-center gap-2 mb-2">
              <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Verified Clinic</span>
              <div className="flex items-center gap-1 text-orange-400">
                 <Star size={12} fill="currentColor" />
                 <span className="text-white text-xs font-bold">{clinic.rating || '4.8'}</span>
              </div>
           </div>
           <h1 className="text-3xl font-black text-white leading-tight">{clinic.name}</h1>
           <p className="text-white/80 text-xs font-medium mt-1 flex items-center gap-1">
              <MapPin size={12} /> {clinic.address}
           </p>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 right-6 flex gap-1.5">
           {images.map((_, i) => (
             <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all ${activeImage === i ? 'w-6 bg-teal-500' : 'w-1.5 bg-white/40'}`} 
             />
           ))}
        </div>
      </section>

      {/* Action Row */}
      <section className="px-6 -mt-6 relative z-10">
         <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-4 flex justify-between border border-gray-100 dark:border-gray-800">
            <button className="flex flex-col items-center gap-1.5 px-3">
               <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-teal-600"><Phone size={20} /></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Call</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 px-3">
               <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600"><Navigation size={20} /></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Route</span>
            </button>
            <button onClick={handleShare} className="flex flex-col items-center gap-1.5 px-3">
               <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600"><Share2 size={20} /></div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Share</span>
            </button>
            <button onClick={() => setIsBookmarked(!isBookmarked)} className="flex flex-col items-center gap-1.5 px-3">
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isBookmarked ? 'bg-teal-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-400'}`}>
                  <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
               </div>
               <span className="text-[10px] font-bold text-gray-500 uppercase">Save</span>
            </button>
         </div>
      </section>

      {/* About Section */}
      <section className="p-6 space-y-4">
         <div className="flex items-center gap-2">
            <Info size={18} className="text-teal-600" />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">About Clinic</h3>
         </div>
         <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            {clinic.description || 'Welcome to our clinic. We provide top-notch medical services with a team of experienced professionals dedicated to your well-being.'}
         </p>
         <div className="flex items-center gap-4 text-xs font-bold text-teal-600">
            <div className="flex items-center gap-1"><Clock size={14} /> Open until 9:00 PM</div>
            <div className="flex items-center gap-1"><ShieldCheck size={14} /> Certified Excellence</div>
         </div>
      </section>

      {/* Doctors List */}
      <section className="p-6 space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Our Specialists</h3>
            <span className="text-xs font-bold text-gray-400">{clinic.doctors?.length || 0} Available</span>
         </div>

         <div className="space-y-4">
            {(clinic.doctors || []).map((doc) => (
               <motion.div 
                key={doc._id}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded-[28px] border border-transparent hover:border-teal-500/30 transition-all flex items-center gap-4 group"
               >
                  <div className="relative">
                     <img src={doc.photo || `https://i.pravatar.cc/150?u=${doc._id}`} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt={doc.name} />
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-grow">
                     <h4 className="font-black text-gray-900 dark:text-white leading-tight group-hover:text-teal-600 transition-colors">{doc.name}</h4>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">{doc.specialty}</p>
                     <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-[10px] font-black text-orange-400">
                           <Star size={10} fill="currentColor" /> {doc.rating || '4.9'}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 underline">240 Reviews</span>
                     </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/doctors/${doc._id}`)}
                    className="bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-sm text-teal-600 hover:bg-teal-600 hover:text-white transition-all"
                  >
                     <ChevronRight size={20} />
                  </button>
               </motion.div>
            ))}
         </div>
      </section>

    </div>
  );
};

export default ClinicDetail;
