import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Package, Factory, Clock, FlaskConical } from 'lucide-react';

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
  manufacturerName?: string;
  qualityGrade?: string;
  quantity?: number;
  unit?: string;
  status?: string;
  reason?: string;
}

interface NotificationModalProps {
  notification: Notification | null;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export const LabNotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose, onMarkAsRead }) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'BATCH_RECEIVED':
        return <Package className="w-12 h-12 text-blue-600" />;
      case 'SENT_TO_MANUFACTURING':
        return <Factory className="w-12 h-12 text-purple-600" />;
      default:
        return <FlaskConical className="w-12 h-12 text-teal-600" />;
    }
  };

  const getStatusColor = () => {
    switch (notification.type) {
      case 'BATCH_RECEIVED':
        return 'bg-blue-50 border-blue-200';
      case 'SENT_TO_MANUFACTURING':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-teal-50 border-teal-200';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleClose = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className={`p-6 border-b-2 ${getStatusColor()}`}>
            <div className="flex items-center gap-4">
              {getIcon()}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{notification.title}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(notification.timestamp)}</span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 leading-relaxed">{notification.message}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Batch ID</p>
                <p className="text-sm font-bold text-gray-900">{notification.batchId}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Product</p>
                <p className="text-sm font-bold text-gray-900">{notification.productName}</p>
              </div>
              
              {notification.farmerName && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Farmer</p>
                  <p className="text-sm font-bold text-gray-900">{notification.farmerName}</p>
                </div>
              )}

              {notification.quantity && notification.unit && (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Quantity</p>
                  <p className="text-sm font-bold text-gray-900">{notification.quantity} {notification.unit}</p>
                </div>
              )}

              {notification.qualityGrade && (
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Quality Grade</p>
                  <p className={`text-sm font-bold ${
                    notification.qualityGrade === 'A' ? 'text-green-600' :
                    notification.qualityGrade === 'B' ? 'text-blue-600' :
                    notification.qualityGrade === 'C' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    Grade {notification.qualityGrade}
                  </p>
                </div>
              )}

              {notification.manufacturerName && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Manufacturer</p>
                  <p className="text-sm font-bold text-gray-900">{notification.manufacturerName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};
