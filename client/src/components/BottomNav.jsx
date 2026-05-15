import { NavLink } from "react-router-dom";
import { Home, Search, Calendar, User } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/search", icon: Search, label: "Search" },
  { path: "/my-bookings", icon: Calendar, label: "Bookings" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-100 dark:border-zinc-800 safe-bottom">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center space-y-1 transition-colors duration-200",
                isActive
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-zinc-400 dark:text-zinc-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={24}
                  className={cn("transition-transform duration-200", isActive && "scale-110")}
                />
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-current" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
