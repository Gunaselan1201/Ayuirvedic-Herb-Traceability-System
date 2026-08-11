import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, XCircle, Package } from 'lucide-react';

export default function NotificationSidebar({ 
  isOpen, 
  onClose, 
  notifications, 
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead 
}) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'BATCH_APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'BATCH_REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'SENT_TO_MANUFACTURING':
        return <Package className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 350, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 350, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed right-6 top-24 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Sidebar Header */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-900" />
                <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">Notifications</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>
            {unreadCount > 0 && (
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-600">
                  {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onMarkAllAsRead}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Mark all read
                </motion.button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  You'll see updates about your batches here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 4 }}
                    className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                      notification.isRead
                        ? 'bg-white border border-gray-200 hover:bg-gray-50'
                        : 'bg-green-50 border-2 border-green-300 hover:border-green-400'
                    }`}
                    onClick={() => onNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-relaxed ${
                            notification.isRead ? 'text-gray-700' : 'text-gray-900 font-semibold'
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Last Login Time */}
          <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 text-right">
            <p className="text-xs text-gray-600">Updated just now</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
