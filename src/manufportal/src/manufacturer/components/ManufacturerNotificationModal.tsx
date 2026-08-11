import React from 'react';
import { motion } from 'framer-motion';
import { X, Package, CheckCircle, Calendar, User, Hash } from 'lucide-react';

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

interface ManufacturerNotificationModalProps {
  notification: Notification;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
}

export function ManufacturerNotificationModal({ 
  notification, 
  onClose, 
  onMarkAsRead 
}: ManufacturerNotificationModalProps) {
  const handleClose = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className='bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white'>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold mb-2'>{notification.title}</h2>
              <p className='text-amber-100 text-sm'>
                {new Date(notification.timestamp).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleClose}
              className='text-white hover:bg-white/20 rounded-lg p-2 transition-colors'
              aria-label='Close notification'
              title='Close notification'
            >
              <X className='w-6 h-6' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 space-y-6'>
          {/* Message */}
          <div>
            <h3 className='text-sm font-semibold text-gray-700 mb-2'>Message</h3>
            <p className='text-gray-900 leading-relaxed'>{notification.message}</p>
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-1 gap-4'>
            {/* Batch ID */}
            <div className='bg-amber-50 rounded-lg p-4'>
              <div className='flex items-center gap-3'>
                <Hash className='w-5 h-5 text-amber-600' />
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Batch ID</p>
                  <p className='text-sm font-bold text-gray-900'>{notification.batchId}</p>
                </div>
              </div>
            </div>

            {/* Product Name */}
            <div className='bg-orange-50 rounded-lg p-4'>
              <div className='flex items-center gap-3'>
                <Package className='w-5 h-5 text-orange-600' />
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Product</p>
                  <p className='text-sm font-bold text-gray-900'>{notification.productName}</p>
                </div>
              </div>
            </div>

            {/* Grade (if available) */}
            {notification.grade && (
              <div className='bg-green-50 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-5 h-5 text-green-600' />
                  <div>
                    <p className='text-xs text-gray-600 font-medium'>Quality Grade</p>
                    <p className='text-sm font-bold text-gray-900'>Grade {notification.grade}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Farmer Info (if available) */}
            {notification.farmerName && (
              <div className='bg-blue-50 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                  <User className='w-5 h-5 text-blue-600' />
                  <div>
                    <p className='text-xs text-gray-600 font-medium'>Farmer</p>
                    <p className='text-sm font-bold text-gray-900'>{notification.farmerName}</p>
                    {notification.farmerId && (
                      <p className='text-xs text-gray-600'>ID: {notification.farmerId}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity (if available) */}
            {notification.quantity && notification.unit && (
              <div className='bg-purple-50 rounded-lg p-4'>
                <div className='flex items-center gap-3'>
                  <Package className='w-5 h-5 text-purple-600' />
                  <div>
                    <p className='text-xs text-gray-600 font-medium'>Quantity</p>
                    <p className='text-sm font-bold text-gray-900'>
                      {notification.quantity} {notification.unit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <div className='flex items-center gap-3'>
                <Calendar className='w-5 h-5 text-gray-600' />
                <div>
                  <p className='text-xs text-gray-600 font-medium'>Received</p>
                  <p className='text-sm font-bold text-gray-900'>
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-gray-50 px-6 py-4 flex justify-end gap-3'>
          <button
            onClick={handleClose}
            className='px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg'
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
