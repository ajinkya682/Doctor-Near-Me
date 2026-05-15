import { useIsFetching } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";

export default function MainLayout({ children }) {
  const isFetching = useIsFetching();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center">
      {/* Background Refetch Indicator */}
      {isFetching > 0 && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 flex justify-center">
          <div className="w-full max-w-mobile bg-primary-500 animate-pulse" />
        </div>
      )}

      {/* Main Column constrained to 480px */}
      <main className="w-full max-w-mobile min-h-screen bg-white dark:bg-zinc-900 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none flex flex-col relative">
        <TopBar />
        
        <div className="flex-1 flex flex-col pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <BottomNav />
      </main>
    </div>
  );
}
