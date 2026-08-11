import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XCircle, AlertOctagon, RotateCcw, ArrowLeft } from 'lucide-react';

const RejectedOrders = ({ currentLanguage, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const t = (key) => {
    const translations = {
      en: {
        rejectedOrders: 'Rejected Orders',
        noOrders: 'No rejected orders',
        productName: 'Product Name',
        batchId: 'Batch ID',
        rejectedOn: 'Rejected On',
        reason: 'Reason',
        poorQuality: 'Poor Quality',
        quantityMismatch: 'Quantity Mismatch',
        duplicateEntry: 'Duplicate Entry',
        manualReject: 'Manual Reject',
        quantity: 'Quantity',
        manufacturer: 'Manufacturer',
        appeal: 'Appeal',
        reconsider: 'Reconsider',
      },
      ta: {
        rejectedOrders: 'நிராகரிக்கப்பட்ட ஆர்டர்கள்',
        noOrders: 'நிராகரிக்கப்பட்ட ஆர்டர்கள் இல்லை',
        productName: 'தயாரிப்பு பெயர்',
        batchId: 'தொகுதி ID',
        rejectedOn: 'நிராகரிக்கப்பட்ட தேதி',
        reason: 'காரணம்',
        poorQuality: 'மோசமான தரம்',
        quantityMismatch: 'அளவு பொருந்தவில்லை',
        duplicateEntry: 'நகல் பதிவு',
        manualReject: 'கைமுறை நிராகரிப்பு',
        quantity: 'அளவு',
        manufacturer: 'உற்பத்தியாளர்',
        appeal: 'மேல்முறையீடு',
        reconsider: 'மறுபரிசீலனை',
      },
      hi: {
        rejectedOrders: 'अस्वीकृत आदेश',
        noOrders: 'कोई अस्वीकृत आदेश नहीं',
        productName: 'उत्पाद का नाम',
        batchId: 'बैच ID',
        rejectedOn: 'अस्वीकृत तिथि',
        reason: 'कारण',
        poorQuality: 'खराब गुणवत्ता',
        quantityMismatch: 'मात्रा बेमेल',
        duplicateEntry: 'डुप्लिकेट प्रविष्टि',
        manualReject: 'मैनुअल अस्वीकार',
        quantity: 'मात्रा',
        manufacturer: 'निर्माता',
        appeal: 'अपील',
        reconsider: 'पुनर्विचार',
      }
    };
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    fetchRejectedOrders();
  }, []);

  const fetchRejectedOrders = async () => {
    try {
      const resp = await fetch('http://localhost:3001/events');
      if (!resp.ok) throw new Error('Failed to fetch');
      const ledgerData = await resp.json();

      // Get batches with qualityGrade F or Rejected
      const rejectedOrders = ledgerData
        .filter(entry => entry && entry.stage === 'lab' && 
                (entry.data.qualityGrade === 'F' || entry.data.qualityGrade === 'Rejected'))
        .map(entry => ({
          id: entry.batchId,
          batchId: entry.batchId,
          productName: entry.data.productName || 'Unknown',
          quantity: entry.data.quantity || 'N/A',
          manufacturer: entry.data.manufacturerName || 'N/A',
          rejectedOn: entry.timestamp,
          reason: entry.data.rejectionReason || 'Failed quality standards'
        }));
      
      setOrders(rejectedOrders);
    } catch (error) {
      console.error('Error fetching rejected orders:', error);
      setOrders([]);
    }
  };

  const handleAppeal = async (order) => {
    console.log('Appeal requested for:', order);
    // TODO: Implement appeal logic - send to admin/review queue
  };

  const handleReconsider = async (order) => {
    console.log('Reconsider requested for:', order);
    // TODO: Move back to active orders for review
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
          {t('rejectedOrders')}
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <XCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">{t('noOrders')}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertOctagon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{order.productName}</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-600">{t('batchId')}</p>
                          <p className="font-semibold text-gray-800">{order.batchId}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">{t('quantity')}</p>
                          <p className="font-semibold text-gray-800">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">{t('manufacturer')}</p>
                          <p className="font-semibold text-gray-800">{order.manufacturer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">{t('rejectedOn')}</p>
                          <p className="font-semibold text-gray-800">
                            {new Date(order.rejectedOn).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-xs text-gray-600 mb-1">{t('reason')}</p>
                        <p className="font-semibold text-red-700">{t(order.reason.toLowerCase().replace(' ', ''))}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAppeal(order)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('appeal')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReconsider(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      {t('reconsider')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RejectedOrders;
