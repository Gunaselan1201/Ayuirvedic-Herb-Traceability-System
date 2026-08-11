import React from 'react';
import { motion } from 'framer-motion';
import { Factory, Menu, Bell } from 'lucide-react';

interface ManufacturerNavbarProps {
  session: { manufacturerId: string };
  onLogout: () => void;
  onMenuClick: () => void;
  onDashboardClick: () => void;
  onNotificationClick: () => void;
  unreadCount: number;
}

export function ManufacturerNavbar({ 
  session, 
  onMenuClick, 
  onDashboardClick,
  onNotificationClick,
  unreadCount 
}: ManufacturerNavbarProps) {
  return (
    <nav className='bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg sticky top-0 z-30'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-18 py-3'>
          {/* Left: Menu + Logo */}
          <div className='flex items-center gap-4'>
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='text-white hover:bg-white/20 p-2 rounded-lg transition-colors'
              aria-label='Open menu'
              title='Open menu'
            >
              <Menu className='w-6 h-6' />
            </motion.button>

            <motion.div
              onClick={onDashboardClick}
              whileHover={{ scale: 1.05 }}
              className='flex items-center gap-3 cursor-pointer'
            >
              <Factory className='w-8 h-8 text-white' />
              <div>
                <h1 className='text-xl font-bold text-white'>Manufacturer Portal</h1>
                <p className='text-xs text-amber-100'>Production Management</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Notifications + User */}
          <div className='flex items-center gap-4'>
            {/* Notification Bell */}
            <motion.button
              onClick={onNotificationClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='relative text-white hover:bg-white/20 p-2 rounded-lg transition-colors'
              aria-label='Open notifications'
              title='Open notifications'
            >
              <Bell className='w-6 h-6' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* User Info */}
            <div className='bg-white/20 px-4 py-2 rounded-lg'>
              <p className='text-sm font-medium text-white'>
                ID: {session.manufacturerId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
