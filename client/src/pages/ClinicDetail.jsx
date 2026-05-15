import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star, Clock, Navigation, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const DEMO_CLINIC = {
  id: "1",
  name: "City Health Center",
  address: "Bandra West, Mumbai, Maharashtra 400050",
  phone: "+91 98765 43210",
  rating: 4.8,
  reviews: 124,
  image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
  status: "Open",
  hours: "09:00 AM - 08:00 PM",
  doctors: [
    { id: "d1", name: "Dr. Sarah Johnson", specialty: "Cardiologist", experience: "12 years", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400" },
    { id: "d2", name: "Dr. Michael Chen", specialty: "Dermatologist", experience: "8 years", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400" },
  ]
};

export default function ClinicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, we'd fetch the clinic by ID. For now, using demo data.
  const clinic = DEMO_CLINIC;

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-900 pb-10">
      {/* Banner Image */}
      <div className="relative h-60 shrink-0">
        <img src={clinic.image} className="w-full h-full object-cover" alt={clinic.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Clinic Info */}
      <div className="px-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-xl shadow-black/5 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{clinic.name}</h1>
            <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-lg text-xs font-bold">
              <Star size={14} className="fill-yellow-600" />
              <span>{clinic.rating}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin size={18} className="text-primary-600 shrink-0 mt-0.5" />
              <span>{clinic.address}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-zinc-500 dark:text-zinc-400">
              <Phone size={18} className="text-primary-600 shrink-0" />
              <span>{clinic.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock size={18} className="text-primary-600 shrink-0" />
              <div className="flex items-center space-x-2">
                <span className="font-bold text-emerald-600">Open Now</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-500 dark:text-zinc-400">{clinic.hours}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.name}`, "_blank")}
            className="w-full py-4 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-colors"
          >
            <Navigation size={18} />
            <span>Get Directions</span>
          </button>
        </div>
      </div>

      {/* Doctors List */}
      <div className="px-6 mt-8 space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Specialists</h2>
        <div className="space-y-3">
          {clinic.doctors.map((doc) => (
            <motion.div 
              whileTap={{ scale: 0.98 }}
              key={doc.id}
              onClick={() => navigate(`/doctor/${doc.id}`)}
              className="card-premium p-4 flex items-center space-x-4 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                <img src={doc.image} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{doc.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{doc.specialty}</p>
                <div className="flex items-center mt-1 text-[10px] text-zinc-400 font-medium">
                  <CheckCircle2 size={12} className="mr-1 text-primary-500" />
                  {doc.experience} Experience
                </div>
              </div>
              <div className="p-2 bg-primary-50 dark:bg-primary-950/30 rounded-xl text-primary-600">
                <ArrowLeft size={18} className="rotate-180" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
