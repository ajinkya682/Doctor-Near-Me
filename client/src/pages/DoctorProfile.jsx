import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Star, MapPin, Clock, ShieldCheck, 
  Award, GraduationCap, Calendar, MessageCircle, MoreVertical
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/useStore';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch Real Doctor Data
  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor', id],
    queryFn: async () => {
      const res = await api.get(`/doctors/${id}`);
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-32">
      {/* Header */}
      <header className="p-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"><ChevronLeft size={24} /></button>
        <h2 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Doctor Profile</h2>
        <button className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-900 dark:text-white border border-gray-100 dark:border-gray-800"><MoreVertical size={20} /></button>
      </header>

      {/* Profile Hero */}
      <section className="px-6 pt-2">
         <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-teal-500/20">
            <div className="flex flex-col items-center relative z-10">
               <div className="relative mb-4">
                  <img src={doctor.profilePhoto} className="w-28 h-28 rounded-3xl object-cover border-4 border-white/20 shadow-xl" alt={doctor.name} />
                  <div className="absolute -bottom-2 -right-2 bg-white text-teal-600 p-1.5 rounded-xl shadow-lg">
                     <ShieldCheck size={18} fill="currentColor" className="text-teal-600/20" />
                  </div>
               </div>
               <h1 className="text-2xl font-black">{doctor.name}</h1>
               <p className="text-white/80 text-sm font-bold uppercase tracking-widest mt-1">{doctor.specialization}</p>
               
               <div className="flex gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
                     <p className="text-xs font-bold opacity-70">Experience</p>
                     <p className="text-sm font-black">{doctor.experience}Y+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
                     <p className="text-xs font-bold opacity-70">Patients</p>
                     <p className="text-sm font-black">2.5K+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
                     <p className="text-xs font-bold opacity-70">Rating</p>
                     <p className="text-sm font-black flex items-center gap-1"><Star size={12} fill="currentColor" /> {doctor.averageRating}</p>
                  </div>
               </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-teal-400/20 rounded-full blur-3xl" />
         </div>
      </section>

      {/* Info Sections */}
      <section className="p-6 space-y-8">
         {/* Bio */}
         <div className="space-y-3">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
               <Award size={18} className="text-teal-500" /> About Doctor
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
               {doctor.bio || `Dr. ${doctor.name} is a highly skilled ${doctor.specialization} specialist with over ${doctor.experience} years of experience in providing exceptional healthcare.`}
            </p>
         </div>

         {/* Qualifications */}
         <div className="space-y-4">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
               <GraduationCap size={18} className="text-teal-500" /> Qualifications
            </h3>
            <div className="space-y-3">
               {doctor.qualifications?.length > 0 ? doctor.qualifications.map((q, i) => (
                 <div key={i} className="flex gap-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 font-black text-xs uppercase tracking-tighter">
                       {q.degree.slice(0, 3)}
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-gray-900 dark:text-white">{q.degree}</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{q.institute} • {q.year}</p>
                    </div>
                 </div>
               )) : (
                 <p className="text-sm text-gray-400">MD in {doctor.specialization} from AIIMS Delhi</p>
               )}
            </div>
         </div>

         {/* Working Hours */}
         <div className="space-y-3">
            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
               <Clock size={18} className="text-teal-500" /> Working Hours
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-[32px] border border-gray-100 dark:border-gray-800">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mon - Fri</p>
                     <p className="text-xs font-black text-gray-900 dark:text-white">09:00 AM - 18:00 PM</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saturday</p>
                     <p className="text-xs font-black text-gray-900 dark:text-white">10:00 AM - 14:00 PM</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Sticky Booking Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 z-30">
         <div className="max-w-[480px] mx-auto flex gap-4">
            <button className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-3xl flex items-center justify-center text-teal-600 border border-gray-200 dark:border-gray-800">
               <MessageCircle size={24} />
            </button>
            <button 
              onClick={() => navigate(`/doctors/${id}/book`)}
              className="flex-grow bg-teal-600 text-white font-black text-lg rounded-3xl shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
               <Calendar size={20} /> Book Appointment
            </button>
         </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
