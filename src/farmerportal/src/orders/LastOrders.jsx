import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Download, ArrowLeft } from 'lucide-react';

const LastOrders = ({ currentLanguage, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const t = (key) => {
    const translations = {
      en: {
        lastOrders: 'Order History',
        noOrders: 'No order history available',
        search: 'Search by product or batch ID',
        filter: 'Filter',
        all: 'All',
        completed: 'Completed',
        expired: 'Expired',
        cancelled: 'Cancelled',
        productName: 'Product Name',
        batchId: 'Batch ID',
        completionDate: 'Date',
        status: 'Status',
        archivedHash: 'Hash',
        reorder: 'Reorder',
        exportAll: 'Export All',
      },
      ta: {
        lastOrders: 'ஆர்டர் வரலாறு',
        noOrders: 'ஆர்டர் வரலாறு இல்லை',
        search: 'தயாரிப்பு அல்லது தொகுதி ID மூலம் தேடுங்கள்',
        filter: 'வடிகட்டி',
        all: 'அனைத்தும்',
        completed: 'முடிக்கப்பட்டது',
        expired: 'காலாவதியானது',
        cancelled: 'ரத்து செய்யப்பட்டது',
        productName: 'தயாரிப்பு பெயர்',
        batchId: 'தொகுதி ID',
        completionDate: 'தேதி',
        status: 'நிலை',
        archivedHash: 'ஹாஷ்',
        reorder: 'மறுஆர்டர்',
        exportAll: 'அனைத்தையும் ஏற்றுமதி செய்க',
      },
      hi: {
        lastOrders: 'आदेश इतिहास',
        noOrders: 'कोई आदेश इतिहास उपलब्ध नहीं',
        search: 'उत्पाद या बैच ID से खोजें',
        filter: 'फ़िल्टर',
        all: 'सब',
        completed: 'पूर्ण',
        expired: 'समाप्त',
        cancelled: 'रद्द',
        productName: 'उत्पाद का नाम',
        batchId: 'बैच ID',
        completionDate: 'तारीख',
        status: 'स्थिति',
        archivedHash: 'हैश',
        reorder: 'पुन: आदेश',
        exportAll: 'सभी निर्यात करें',
      }
    };
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const resp = await fetch('http://localhost:3001/events');
      if (!resp.ok) throw new Error('Failed to fetch');
      const ledgerData = await resp.json();

      // Get all farmer stage events (batch submissions), sorted by timestamp (most recent first)
      const allOrders = ledgerData
        .filter(entry => entry.stage === 'farmer')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .map((entry, index) => ({
          id: entry.batchId,
          batchId: entry.batchId,
          productName: entry.data.productName || 'Unknown',
          quantity: entry.data.quantity || 'N/A',
          unit: entry.data.unit || '',
          dateTime: entry.timestamp,
          isLastSubmitted: index === 0
        }));
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching order history:', error);
      setOrders([]);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.batchId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleExportAll = () => {
    console.log('Exporting all orders...');
    // TODO: Generate PDF/Excel with all orders
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
        
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800"
          >
            {t('lastOrders')}
          </motion.h1>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportAll}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            {t('exportAll')}
          </motion.button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </motion.div>

        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">{t('noOrders')}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredOrders.map((order, index) => (
              order.isLastSubmitted ? (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Last Submitted
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Archive className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Product Name</p>
                      <p className="font-bold text-gray-800 text-lg">{order.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Batch ID</p>
                      <p className="font-bold text-blue-700 text-lg">{order.batchId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="font-semibold text-gray-800">{order.quantity} {order.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.dateTime).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.dateTime).toLocaleTimeString('en-GB')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Archive className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Product Name</p>
                      <p className="font-semibold text-gray-800">{order.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Batch ID</p>
                      <p className="font-semibold text-gray-800">{order.batchId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="font-semibold text-gray-800">{order.quantity} {order.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.dateTime).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.dateTime).toLocaleTimeString('en-GB')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              )
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LastOrders;
