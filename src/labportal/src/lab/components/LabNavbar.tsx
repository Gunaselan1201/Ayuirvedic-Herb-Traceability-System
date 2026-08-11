import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface LabNavbarProps {
  session: { labId: string } | null;
  onLogout: () => void;
  onMenuClick?: () => void;
  onDashboardClick?: () => void;
  onNotificationClick?: () => void;
  unreadCount?: number;
  sidebarOpen?: boolean;
}

export function LabNavbar({ session, onLogout, onMenuClick, onDashboardClick, onNotificationClick, unreadCount = 0, sidebarOpen = false }: LabNavbarProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 relative z-50 shadow-lg sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[65px] py-2">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Icon */}
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={sidebarOpen ? "open" : "closed"}
                className="w-6 h-6 flex flex-col justify-center items-center gap-1.5"
              >
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 8 }
                  }}
                  className="w-6 h-0.5 bg-white rounded-full block"
                />
                <motion.span
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                  className="w-6 h-0.5 bg-white rounded-full block"
                />
                <motion.span
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -8 }
                  }}
                  className="w-6 h-0.5 bg-white rounded-full block"
                />
              </motion.div>
            </motion.button>

            {/* Profile Section - No Click Handler */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white/40 mt-2"></div>
                  <div className="w-10 h-6 bg-white/60 rounded-t-full mt-1"></div>
                </div>
              </div>
              {session && (
                <div>
                  <div className="font-semibold text-white">Lab Technician</div>
                  <div className="text-xs text-blue-100">{session.labId}</div>
                </div>
              )}
            </div>
          </div>
      
      <div 
        onClick={() => {
          if (session && onDashboardClick) {
            onDashboardClick();
          }
        }}
        className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold tracking-tight cursor-pointer text-white"
      >
        <span className="text-white">LAB PORTAL</span>
      </div>
      
      <div className="text-sm">
        {session ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNotificationClick}
            className="relative p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        ) : (
          <span className="text-white/70">Please login</span>
        )}
        </div>
      </div>
      </div>
    </header>
  );
}


