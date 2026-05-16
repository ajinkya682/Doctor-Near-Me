import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, Star, Clock, ShieldCheck, 
  Settings, Trash2, CheckCircle2, AlertCircle,
  Stethoscope, GraduationCap, Award, MoreVertical
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const ClinicDoctors = () => {
  // Mock data for UI development
  const doctors = [
    { 
      id: '1', 
      name: 'Dr. Amit Mehta', 
      specialization: 'Pediatrician', 
      experience: 12, 
      rating: 4.8, 
      status: 'active',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&h=200'
    },
    { 
      id: '2', 
      name: 'Dr. Sarah Johnson', 
      specialization: 'Cardiologist', 
      experience: 15, 
      rating: 4.9, 
      status: 'onLeave',
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&h=200'
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Medical Staff</h1>
            <p className="text-sm font-bold text-gray-400">Manage your doctors, specialties, and their availability.</p>
         </div>
         <button className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-teal-500/20 active:scale-95 transition-transform">
            <UserPlus size={18} /> Add New Doctor
         </button>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-[32px] border border-teal-100 dark:border-teal-900/20">
            <h4 className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Active Doctors</h4>
            <p className="text-3xl font-black text-teal-700 dark:text-teal-400 mt-1">08</p>
         </div>
         <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-[32px] border border-blue-100 dark:border-blue-900/20">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Total Specialties</h4>
            <p className="text-3xl font-black text-blue-700 dark:text-blue-400 mt-1">05</p>
         </div>
         <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-[32px] border border-orange-100 dark:border-orange-900/20">
            <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Doctors on Leave</h4>
            <p className="text-3xl font-black text-orange-700 dark:text-orange-400 mt-1">02</p>
         </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         {doctors.map((doc) => (
            <div key={doc.id} className="bg-white dark:bg-gray-900 p-6 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 relative overflow-hidden group">
               {/* Status Badge */}
               <div className="absolute top-6 right-6">
                  <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                     doc.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                     {doc.status === 'active' ? '● Available' : '○ On Leave'}
                  </div>
               </div>

               <div className="flex gap-6">
                  <div className="relative">
                     <img src={doc.photo} className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-gray-100 dark:border-gray-800" alt={doc.name} />
                     <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-1.5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-teal-600">
                        <ShieldCheck size={16} fill="currentColor" className="text-teal-600/20" />
                     </div>
                  </div>
                  
                  <div className="flex-grow pt-1">
                     <h3 className="text-xl font-black text-gray-900 dark:text-white">{doc.name}</h3>
                     <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <Stethoscope size={12} /> {doc.specialization}
                     </p>
                     
                     <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                           <Award size={14} className="text-orange-400" /> {doc.experience}Y Exp
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                           <Star size={14} className="text-orange-400" fill="currentColor" /> {doc.rating} Rating
                        </div>
                     </div>
                  </div>
               </div>

               {/* Action Bar */}
               <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex gap-2">
                     <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                        <Clock size={14} /> Schedule
                     </button>
                     <button className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                        <Settings size={14} /> Edit Profile
                     </button>
                  </div>
                  <button className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default ClinicDoctors;
