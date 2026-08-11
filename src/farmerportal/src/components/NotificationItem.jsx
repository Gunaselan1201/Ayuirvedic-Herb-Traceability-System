import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Factory, Clock, Eye } from 'lucide-react';

const NotificationItem = ({ notification, onClick, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'BATCH_APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'BATCH_REJECTED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'SENT_TO_MANUFACTURING':
        return <Factory className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.status) {
      case 'approved':
        return 'border-l-green-500';
      case 'rejected':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(notification)}
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getBorderColor()} ${
        !notification.isRead ? 'border-2 border-gray-300' : 'border border-gray-200'
      } hover:shadow-lg transition-all duration-200 cursor-pointer relative`}
    >
      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />
      )}

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-bold text-gray-900 mb-1 ${
            !notification.isRead ? 'font-extrabold' : ''
          }`}>
            {notification.title}
          </h4>
          
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{formatTime(notification.timestamp)}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
              <Eye className="w-3 h-3" />
              <span>View Details</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
