import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { List, Map as MapIcon, SlidersHorizontal, Star, MapPin, Navigation, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Skeleton } from "../components/Skeleton";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 19.076,
  lng: 72.877, // Mumbai
};

export default function Search() {
  const [view, setView] = useState("list");
  const [coords, setCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle, pending, success, denied
  const [selectedClinic, setSelectedClinic] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
  });

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationStatus("pending");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus("success");
        },
        () => {
          setLocationStatus("denied");
        }
      );
    } else {
      setLocationStatus("denied");
    }
  };

  const { data: clinics, isLoading } = useQuery({
    queryKey: ["nearbyClinics", coords],
    queryFn: async () => {
      if (!coords) return [];
      const res = await api.get(`/clinics/nearby?lat=${coords.lat}&lng=${coords.lng}&radius=5000`);
      return res.data;
    },
    enabled: !!coords,
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 overflow-hidden">
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

      {/* Filters (List View only or both?) */}
      <div className="px-6 py-3 overflow-x-auto no-scrollbar flex space-x-2 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <SlidersHorizontal size={14} /> <span>Filters</span>
        </button>
        {["Specialty", "Distance", "Rating", "Available Today"].map((f) => (
          <button key={f} className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
            {f}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {locationStatus === "pending" && (
          <div className="absolute inset-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <MapPin size={32} className="text-primary-600" />
            </div>
            <h2 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">Requesting Location...</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">We need your location to find the nearest doctors and clinics for you.</p>
          </div>
        )}

        {locationStatus === "denied" && (
          <div className="absolute inset-0 z-20 bg-white dark:bg-zinc-900 flex flex-col items-center justify-center p-8 text-center">
            <Navigation size={48} className="text-zinc-300 mb-4" />
            <h2 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100">Location Access Denied</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Please enable location permissions in your browser settings to find nearby clinics.</p>
            <button onClick={getLocation} className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold">Try Again</button>
          </div>
        )}

        {view === "list" ? (
          <div className="h-full overflow-y-auto px-6 py-4 space-y-4 no-scrollbar">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="card-premium p-4 flex space-x-4 animate-pulse">
                  <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 pt-2" />
                  </div>
                </div>
              ))
            ) : clinics?.length > 0 ? (
              clinics.map((clinic) => (
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
                      <div className="flex items-center text-primary-600"><MapPin size={12} className="mr-0.5" /> {clinic.distance?.toFixed(1) || "1.2"} km</div>
                      <div className="flex items-center text-yellow-500"><Star size={12} className="mr-0.5 fill-yellow-500" /> 4.8</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                <Info size={40} className="mb-2" />
                <p>No clinics found in this area.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={coords || defaultCenter}
                zoom={14}
                options={{
                  disableDefaultUI: true,
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                }}
              >
                {clinics?.map((clinic) => (
                  <Marker
                    key={clinic._id}
                    position={{
                      lat: clinic.location.coordinates[1],
                      lng: clinic.location.coordinates[0],
                    }}
                    onClick={() => setSelectedClinic(clinic)}
                    icon={{
                      path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                      fillColor: "#0ea5e9",
                      fillOpacity: 1,
                      strokeWeight: 2,
                      strokeColor: "#ffffff",
                      scale: 2,
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            )}

            {/* Bottom Sheet */}
            <AnimatePresence>
              {selectedClinic && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="absolute bottom-4 left-4 right-4 z-10"
                >
                  <div className="card-premium p-4 flex space-x-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <img src={selectedClinic.photos?.[0] || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200"} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{selectedClinic.name}</h3>
                        <button onClick={() => setSelectedClinic(null)} className="p-1 -mr-1 text-zinc-400 hover:text-zinc-600">✕</button>
                      </div>
                      <p className="text-xs text-zinc-500 truncate mb-2">{selectedClinic.address}</p>
                      <button className="w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-bold mt-1 shadow-md shadow-primary-500/20">
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
