import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Truck, AlertCircle, X, ArrowLeft } from 'lucide-react';

const ActiveOrders = ({ currentLanguage, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const t = (key) => {
    const translations = {
      en: {
        activeOrders: 'Active Orders',
        noOrders: 'No active orders at the moment',
        productName: 'Product Name',
        batchId: 'Batch ID',
        quantity: 'Quantity',
        orderDate: 'Order Date',
        status: 'Status',
        pending: 'Pending',
        accepted: 'Accepted',
        inProcess: 'In Process',
        accept: 'Accept Order',
        reject: 'Reject Order',
        rejectTitle: 'Reject Order',
        rejectReason: 'Rejection Reason',
        selectReason: 'Select a reason',
        poorQuality: 'Poor Quality',
        quantityMismatch: 'Quantity Mismatch',
        duplicateEntry: 'Duplicate Entry',
        manualReject: 'Manual Reject',
        cancel: 'Cancel',
        confirm: 'Confirm Rejection',
        manufacturer: 'Manufacturer',
      },
      ta: {
        activeOrders: 'செயலில் உள்ள ஆர்டர்கள்',
        noOrders: 'தற்போது செயலில் உள்ள ஆர்டர்கள் இல்லை',
        productName: 'தயாரிப்பு பெயர்',
        batchId: 'தொகுதி ID',
        quantity: 'அளவு',
        orderDate: 'ஆர்டர் தேதி',
        status: 'நிலை',
        pending: 'நிலுவையில்',
        accepted: 'ஏற்றுக்கொள்ளப்பட்டது',
        inProcess: 'செயலில்',
        accept: 'ஆர்டரை ஏற்கவும்',
        reject: 'ஆர்டரை நிராகரிக்கவும்',
        rejectTitle: 'ஆர்டரை நிராகரி',
        rejectReason: 'நிராகரிப்பு காரணம்',
        selectReason: 'ஒரு காரணத்தை தேர்ந்தெடுக்கவும்',
        poorQuality: 'மோசமான தரம்',
        quantityMismatch: 'அளவு பொருந்தவில்லை',
        duplicateEntry: 'நகல் பதிவு',
        manualReject: 'கைமுறை நிராகரிப்பு',
        cancel: 'ரத்து செய்',
        confirm: 'நிராகரிப்பை உறுதிப்படுத்து',
        manufacturer: 'உற்பத்தியாளர்',
      },
      hi: {
        activeOrders: 'सक्रिय आदेश',
        noOrders: 'फिलहाल कोई सक्रिय आदेश नहीं',
        productName: 'उत्पाद का नाम',
        batchId: 'बैच ID',
        quantity: 'मात्रा',
        orderDate: 'आदेश की तारीख',
        status: 'स्थिति',
        pending: 'लंबित',
        accepted: 'स्वीकृत',
        inProcess: 'प्रक्रिया में',
        accept: 'आदेश स्वीकार करें',
        reject: 'आदेश अस्वीकार करें',
        rejectTitle: 'आदेश अस्वीकार करें',
        rejectReason: 'अस्वीकार का कारण',
        selectReason: 'एक कारण चुनें',
        poorQuality: 'खराब गुणवत्ता',
        quantityMismatch: 'मात्रा बेमेल',
        duplicateEntry: 'डुप्लिकेट प्रविष्टि',
        manualReject: 'मैनुअल अस्वीकार',
        cancel: 'रद्द करें',
        confirm: 'अस्वीकार की पुष्टि करें',
        manufacturer: 'निर्माता',
      }
    };
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      const resp = await fetch('http://localhost:3001/events');
      if (!resp.ok) throw new Error('Failed to fetch');
      const ledgerData = await resp.json();

      // Get batches at farmer or lab stage (active in process)
      const activeOrders = ledgerData
        .filter(entry => entry && (entry.stage === 'farmer' || entry.stage === 'lab'))
        .map(entry => ({
          id: entry.batchId,
          batchId: entry.batchId,
          productName: entry.data.productName || 'Unknown',
          quantity: entry.data.quantity || 'N/A',
          orderDate: entry.timestamp,
          status: entry.stage === 'farmer' ? 'Pending' : 'In Process',
          manufacturer: entry.data.manufacturerName || 'N/A'
        }));
      
      setOrders(activeOrders);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      setOrders([]);
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      // API call to update ledger
      const updatedOrder = {
        ...order,
        status: 'Accepted',
        timestamp: new Date().toISOString()
      };
      
      // Update local state
      setOrders(orders.map(o => o.id === order.id ? updatedOrder : o));
      
      // TODO: Send to backend
      console.log('Order accepted:', updatedOrder);
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleRejectOrder = (order) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  };

  const confirmRejectOrder = async () => {
    if (!rejectReason) return;

    try {
      const rejectedOrder = {
        ...selectedOrder,
        status: 'Rejected',
        reason: rejectReason,
        timestamp: new Date().toISOString()
      };

      // Remove from active orders
      setOrders(orders.filter(o => o.id !== selectedOrder.id));
      
      // TODO: Send to backend and move to rejected orders
      console.log('Order rejected:', rejectedOrder);
      
      setShowRejectModal(false);
      setSelectedOrder(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'Accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Process':
        return <Truck className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-50 border-yellow-200 hover:border-yellow-300';
      case 'Accepted':
        return 'bg-green-50 border-green-200 hover:border-green-300';
      case 'In Process':
        return 'bg-blue-50 border-blue-200 hover:border-blue-300';
      default:
        return 'bg-gray-50 border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-6"
        >
          {t('activeOrders')}
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">{t('noOrders')}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`${getStatusColor(order.status)} border-2 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{order.productName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{order.batchId}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-semibold text-gray-700 mt-1">{t(order.status.toLowerCase().replace(' ', ''))}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('quantity')}:</span>
                    <span className="font-semibold text-gray-800">{order.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('manufacturer')}:</span>
                    <span className="font-semibold text-gray-800">{order.manufacturer}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('orderDate')}:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {order.status === 'Pending' && (
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptOrder(order)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t('accept')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRejectOrder(order)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      {t('reject')}
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('rejectTitle')}</h2>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t('rejectReason')}
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                >
                  <option value="">{t('selectReason')}</option>
                  <option value="Poor Quality">{t('poorQuality')}</option>
                  <option value="Quantity Mismatch">{t('quantityMismatch')}</option>
                  <option value="Duplicate Entry">{t('duplicateEntry')}</option>
                  <option value="Manual Reject">{t('manualReject')}</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={confirmRejectOrder}
                  disabled={!rejectReason}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {t('confirm')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveOrders;
