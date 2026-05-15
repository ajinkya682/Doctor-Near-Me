import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { List, Map as MapIcon, SlidersHorizontal, Star, MapPin, Navigation, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import api from "../lib/api";

// Fix for default marker icons in Leaflet + React
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom branded marker icon
const customIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-2 h-2 bg-white rounded-full"></div>
         </div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const defaultCenter = [19.076, 72.877]; // Mumbai

// Helper to update map center when coords change
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function Search() {
  const [view, setView] = useState("list");
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [selectedClinic, setSelectedClinic] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationStatus("pending");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords([position.coords.latitude, position.coords.longitude]);
          setLocationStatus("success");
        },
        (error) => {
          console.error("Location Error:", error);
          setLocationStatus("denied");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationStatus("denied");
    }
  };

  const { data: clinics, isLoading } = useQuery({
    queryKey: ["nearbyClinics", coords],
    queryFn: async () => {
      if (!coords) return [];
      const res = await api.get(`/clinics/nearby?lat=${coords[0]}&lng=${coords[1]}&radius=5000`);
      return res.data;
    },
    enabled: !!coords,
  });

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
        {locationStatus === "pending" && (
          <div className="absolute inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center p-8 text-center text-zinc-900 dark:text-zinc-100">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <MapPin size={32} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-bold mb-2">Requesting Location...</h2>
            <p className="text-sm opacity-70">Finding the nearest doctors for you.</p>
          </div>
        )}

        {locationStatus === "denied" && (
          <div className="absolute inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center p-8 text-center">
            <Navigation size={48} className="text-zinc-300 mb-4" />
            <h2 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">Location Access Error</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 px-4">We couldn't get your location. Please check your browser settings or use the demo location.</p>
            <div className="flex flex-col space-y-3 w-full max-w-[220px]">
              <button onClick={getLocation} className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold active:scale-95 transition-transform shadow-lg shadow-primary-500/20">
                Try Again
              </button>
              <button 
                onClick={() => {
                  setCoords(defaultCenter);
                  setLocationStatus("success");
                }} 
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold active:scale-95 transition-transform"
              >
                Use Demo Location (Mumbai)
              </button>
            </div>
          </div>
        )}

        {view === "list" ? (
          <div className="h-full overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="card-premium p-4 flex space-x-4 animate-pulse">
                  <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : clinics?.map((clinic) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={clinic._id}
                className="card-premium p-4 flex space-x-4 hover:border-primary-500 transition-colors cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={clinic.photos?.[0] || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{clinic.name}</h3>
                  <p className="text-xs text-zinc-500 truncate mb-2">{clinic.address}</p>
                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <div className="flex items-center text-primary-600"><MapPin size={12} className="mr-0.5" /> {clinic.distance?.toFixed(1)} km</div>
                    <div className="flex items-center text-yellow-500"><Star size={12} className="mr-0.5 fill-yellow-500" /> 4.8</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-full relative isolate">
            <MapContainer
              center={coords || defaultCenter}
              zoom={13}
              scrollWheelZoom={true}
              className="w-full h-full z-10"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {coords && <ChangeView center={coords} />}
              {clinics?.map((clinic) => (
                <Marker
                  key={clinic._id}
                  position={[clinic.location.coordinates[1], clinic.location.coordinates[0]]}
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
                      <img src={selectedClinic.photos?.[0] || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200"} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{selectedClinic.name}</h3>
                        <button onClick={() => setSelectedClinic(null)} className="p-1 -mr-1 text-zinc-400 hover:text-zinc-600">✕</button>
                      </div>
                      <p className="text-xs text-zinc-500 truncate mb-2">{selectedClinic.address}</p>
                      <button className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold mt-1 shadow-lg shadow-primary-500/20 active:scale-95 transition-transform">
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
