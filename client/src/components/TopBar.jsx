import { Sun, Moon, Languages } from "lucide-react";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const { theme, toggleTheme, language, setLanguage } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center justify-between h-14 px-4 max-w-mobile mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Doctor Near Me</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Switcher (Simple) */}
          <button 
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            title="Change Language"
          >
            <Languages size={20} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors overflow-hidden"
            aria-label="Toggle Theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: 20, opacity: 0, rotate: 45 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: -45 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}
