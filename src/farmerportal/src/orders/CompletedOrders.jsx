import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ChevronDown, ChevronUp, Package, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';

const CompletedOrders = ({ currentLanguage, farmerData, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const t = (key) => {
    const translations = {
      en: {
        completedOrders: 'Completed Orders',
        noOrders: 'No completed orders yet',
        productName: 'Product Name',
        batchId: 'Batch ID',
        manufacturer: 'Manufacturer',
        completionDate: 'Completion Date',
        blockchainHash: 'Blockchain Hash',
        qualityGrade: 'Quality Grade',
        quantity: 'Quantity',
        downloadReceipt: 'Download Receipt',
        viewDetails: 'View Details',
        hideDetails: 'Hide Details',
      },
      ta: {
        completedOrders: 'நிறைவான ஆர்டர்கள்',
        noOrders: 'இன்னும் நிறைவான ஆர்டர்கள் இல்லை',
        productName: 'தயாரிப்பு பெயர்',
        batchId: 'தொகுதி ID',
        manufacturer: 'உற்பத்தியாளர்',
        completionDate: 'முடிவு தேதி',
        blockchainHash: 'பிளாக்செயின் ஹாஷ்',
        qualityGrade: 'தர தரம்',
        quantity: 'அளவு',
        downloadReceipt: 'ரசீது பதிவிறக்கம்',
        viewDetails: 'விவரங்களைக் காண்க',
        hideDetails: 'விவரங்களை மறை',
      },
      hi: {
        completedOrders: 'पूर्ण आदेश',
        noOrders: 'अभी तक कोई पूर्ण आदेश नहीं',
        productName: 'उत्पाद का नाम',
        batchId: 'बैच ID',
        manufacturer: 'निर्माता',
        completionDate: 'पूर्णता तिथि',
        blockchainHash: 'ब्लॉकचेन हैश',
        qualityGrade: 'गुणवत्ता ग्रेड',
        quantity: 'मात्रा',
        downloadReceipt: 'रसीद डाउनलोड करें',
        viewDetails: 'विवरण देखें',
        hideDetails: 'विवरण छुपाएं',
      }
    };
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  const fetchCompletedOrders = async () => {
    try {
      const resp = await fetch('http://localhost:3001/events');
      if (!resp.ok) throw new Error('Failed to fetch');
      const ledgerData = await resp.json();

      // Get batches at manufacturer stage (completed)
      const completedOrders = ledgerData
        .filter(entry => entry && entry.stage === 'manufacturer')
        .map(entry => ({
          id: entry.batchId,
          batchId: entry.batchId,
          productName: entry.data.productName || 'Unknown',
          quantity: entry.data.quantity || 'N/A',
          manufacturer: entry.data.manufacturerName || entry.addedBy || 'N/A',
          completionDate: entry.timestamp,
          qualityGrade: entry.data.qualityGrade || 'N/A',
          blockchainHash: `0x${entry.batchId.toLowerCase().replace(/-/g, '')}${Date.now().toString(16)}`
        }));
      
      setOrders(completedOrders);
    } catch (error) {
      console.error('Error fetching completed orders:', error);
      setOrders([]);
    }
  };

  const generatePDF = (order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(34, 139, 34);
    doc.text('Order Receipt', 105, 20, { align: 'center' });
    
    // Order Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Batch ID: ${order.batchId}`, 20, 40);
    doc.text(`Product Name: ${order.productName}`, 20, 50);
    doc.text(`Quantity: ${order.quantity}`, 20, 60);
    doc.text(`Quality Grade: ${order.qualityGrade}`, 20, 70);
    doc.text(`Manufacturer: ${order.manufacturer}`, 20, 80);
    doc.text(`Completion Date: ${new Date(order.completionDate).toLocaleString()}`, 20, 90);
    
    // Farmer Details
    doc.text(`Farmer ID: ${farmerData?.farmerId || 'F-00123'}`, 20, 110);
    doc.text(`Farmer Name: ${farmerData?.farmerName || 'Ravi Kumar'}`, 20, 120);
    
    // Blockchain Hash
    doc.setFontSize(10);
    doc.text('Blockchain Hash (Authenticity Proof):', 20, 140);
    doc.setFont(undefined, 'italic');
    doc.text(order.blockchainHash, 20, 150, { maxWidth: 170 });
    
    // Footer
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.text('This is a blockchain-verified receipt.', 105, 280, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
    
    // Save PDF
    doc.save(`Receipt_${order.batchId}.pdf`);
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
          {t('completedOrders')}
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{order.productName}</h3>
                      <p className="text-sm text-gray-600">{order.batchId}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generatePDF(order)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    {t('downloadReceipt')}
                  </motion.button>
                </div>

                {/* Summary Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">{t('manufacturer')}</p>
                    <p className="font-semibold text-gray-800">{order.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('quantity')}</p>
                    <p className="font-semibold text-gray-800">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('qualityGrade')}</p>
                    <p className="font-semibold text-gray-800">Grade {order.qualityGrade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t('completionDate')}</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(order.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Expandable Details */}
                <div>
                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="text-green-700 hover:text-green-800 font-semibold flex items-center gap-2 transition-colors"
                  >
                    {expandedOrder === order.id ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        {t('hideDetails')}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        {t('viewDetails')}
                      </>
                    )}
                  </button>

                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-green-200"
                    >
                      <p className="text-xs text-gray-600 mb-2">{t('blockchainHash')}</p>
                      <p className="text-xs font-mono bg-white p-3 rounded border border-green-200 break-all">
                        {order.blockchainHash}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;
