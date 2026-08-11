import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Package } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  portalType: string;
  title: string;
  message: string;
  batchId: string;
  productName: string;
  timestamp: string;
  isRead: boolean;
  farmerName?: string;
  farmerId?: string;
  grade?: string;
  quantity?: string;
  unit?: string;
}

interface ManufacturerNotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
}

const ManufacturerNotificationSidebar: React.FC<ManufacturerNotificationSidebarProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'BATCH_SENT_TO_MANUFACTURING':
        return <Package className='w-5 h-5 text-amber-600' />;
      case 'BATCH_APPROVED':
        return <CheckCircle className='w-5 h-5 text-green-600' />;
      case 'PRODUCTION_UPDATE':
        return <AlertCircle className='w-5 h-5 text-blue-600' />;
      default:
        return <Bell className='w-5 h-5 text-gray-600' />;
    }
  };

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';
    switch (type) {
      case 'BATCH_SENT_TO_MANUFACTURING':
        return 'bg-amber-50';
      case 'BATCH_APPROVED':
        return 'bg-green-50';
      case 'PRODUCTION_UPDATE':
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 bg-black bg-opacity-30 z-40'
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed right-6 top-24 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden'
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className='bg-gray-100 px-4 py-3 border-b border-gray-300'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Bell className='w-5 h-5 text-gray-700' />
                  <h2 className='text-base font-bold text-gray-900 uppercase tracking-wide'>
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span className='bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5'>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className='text-gray-600 hover:text-gray-900 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <div className='px-4 py-2 bg-gray-50 border-b border-gray-200'>
                <button
                  onClick={onMarkAllAsRead}
                  className='text-xs text-amber-600 hover:text-amber-700 font-medium'
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 240px)' }}>
              {notifications.length === 0 ? (
                <div className='p-8 text-center'>
                  <Bell className='w-12 h-12 text-gray-300 mx-auto mb-3' />
                  <p className='text-gray-500 text-sm'>No notifications yet</p>
                </div>
              ) : (
                <div className='p-3 space-y-2'>
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onNotificationClick(notification)}
                      className={`${getNotificationBgColor(notification.type, notification.isRead)} 
                        rounded-lg p-3 cursor-pointer transition-all hover:shadow-md border 
                        ${notification.isRead ? 'border-gray-200' : 'border-amber-300'}`}
                    >
                      <div className='flex items-start gap-3'>
                        <div className='mt-1'>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between gap-2 mb-1'>
                            <h3 className='font-semibold text-sm text-gray-900 truncate'>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className='flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1'></span>
                            )}
                          </div>
                          <p className='text-xs text-gray-600 line-clamp-2 mb-2'>
                            {notification.message}
                          </p>
                          <div className='flex items-center justify-between text-xs text-gray-500'>
                            <span>Batch: {notification.batchId}</span>
                            <span>{new Date(notification.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ManufacturerNotificationSidebar;
