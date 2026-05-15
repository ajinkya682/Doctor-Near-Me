import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { List, Map as MapIcon, SlidersHorizontal, Star, MapPin, Navigation, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

// Leaflet Fixes
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const customIcon = new L.DivIcon({
  html: `<div class="w-10 h-10 bg-primary-600 rounded-full border-4 border-white flex items-center justify-center shadow-2xl">
          <div class="w-3 h-3 bg-white rounded-full animate-pulse"></div>
         </div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Demo Data
const DEMO_CLINICS = [
  {
    _id: "1",
    name: "City Health Center",
    address: "Bandra West, Mumbai",
    distance: 1.2,
    rating: 4.8,
    lat: 19.0596,
    lng: 72.8295,
    photos: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400"],
  },
  {
    _id: "2",
    name: "Surya Multispeciality",
    address: "Santacruz East, Mumbai",
    distance: 2.5,
    rating: 4.6,
    lat: 19.0822,
    lng: 72.8500,
    photos: ["https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400"],
  },
  {
    _id: "3",
    name: "Apex Dental Clinic",
    address: "Andheri West, Mumbai",
    distance: 3.8,
    rating: 4.9,
    lat: 19.1136,
    lng: 72.8697,
    photos: ["https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400"],
  },
];

const defaultCenter = [19.076, 72.877];

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function Search() {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [coords, setCoords] = useState(defaultCenter);
  const [locationStatus, setLocationStatus] = useState("success"); // Defaulting to success for demo
  const [selectedClinic, setSelectedClinic] = useState(null);

  // In demo mode, we just use the static data
  const clinics = DEMO_CLINICS;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header with Toggle */}
      <div className="px-6 pt-6 pb-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Find Doctors</h1>
        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${
              view === "list" ? "bg-white dark:bg-zinc-700 shadow-sm text-primary-600" : "text-zinc-500"
            }`}
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setView("map")}
            className={`p-2 rounded-lg transition-all ${
              view === "map" ? "bg-white dark:bg-zinc-700 shadow-sm text-primary-600" : "text-zinc-500"
            }`}
          >
            <MapIcon size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 overflow-x-auto no-scrollbar flex space-x-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <SlidersHorizontal size={14} /> <span>Filters</span>
        </button>
        {["Specialty", "Distance", "Rating"].map((f) => (
          <button key={f} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
            {f}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {view === "list" ? (
          <div className="h-full overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
            {clinics.map((clinic) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={clinic._id}
                onClick={() => navigate(`/clinic/${clinic._id}`)}
                className="card-premium p-4 flex space-x-4 hover:border-primary-500 transition-colors cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={clinic.photos[0]} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{clinic.name}</h3>
                  <p className="text-xs text-zinc-500 truncate mb-2">{clinic.address}</p>
                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div className="flex items-center text-primary-600"><MapPin size={12} className="mr-0.5" /> {clinic.distance} km</div>
                    <div className="flex items-center text-yellow-500"><Star size={12} className="mr-0.5 fill-yellow-500" /> {clinic.rating}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full relative isolate">
            <MapContainer
              center={coords}
              zoom={12}
              scrollWheelZoom={true}
              className="w-full h-full z-10"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ChangeView center={coords} />
              {clinics.map((clinic) => (
                <Marker
                  key={clinic._id}
                  position={[clinic.lat, clinic.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => setSelectedClinic(clinic),
                  }}
                />
              ))}
            </MapContainer>

            {/* Map UI Overlays */}
            <AnimatePresence>
              {selectedClinic && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="absolute bottom-4 left-4 right-4 z-[1000]"
                >
                  <div className="card-premium p-4 flex space-x-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-2xl border-none">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={selectedClinic.photos[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{selectedClinic.name}</h3>
                        <button onClick={() => setSelectedClinic(null)} className="p-1 -mr-1 text-zinc-400 hover:text-zinc-600">✕</button>
                      </div>
                      <p className="text-xs text-zinc-500 truncate mb-2">{selectedClinic.address}</p>
                      <button 
                        onClick={() => navigate(`/clinic/${selectedClinic._id}`)}
                        className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold mt-1 shadow-lg shadow-primary-500/20 active:scale-95 transition-transform"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
