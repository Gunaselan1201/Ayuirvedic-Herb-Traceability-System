import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, CheckCircle, Download, FlaskConical, Package, TrendingUp, Star, FileText } from 'lucide-react';

const ApprovedByLabDetail = ({ batchId, onBack }) => {
  const batchData = {
    id: batchId || 'TUL-2024-1156',
    productName: 'Tulsi (Holy Basil)',
    quantity: '480 kg',
    approvalDate: '2024-10-27',
    grade: 'A+',
    testResults: {
      purity: 98.5,
      moisture: 8.2,
      ashContent: 9.5,
      acidInsoluble: 1.8,
      alcoholExtract: 12.5,
      waterExtract: 15.3
    },
    allocations: [
      { manufacturer: 'Himalaya Wellness', quantity: '200 kg', status: 'Allocated', purpose: 'Herbal Tea Production' },
      { manufacturer: 'Patanjali Ayurved', quantity: '180 kg', status: 'Allocated', purpose: 'Ayurvedic Medicines' },
      { manufacturer: 'Dabur India Ltd', quantity: '100 kg', status: 'Pending', purpose: 'Health Supplements' }
    ],
    testCertificate: {
      certificateNumber: 'QT-2024-1156',
      issuedDate: '2024-10-27',
      validUntil: '2025-10-27',
      labName: 'Quality Testing Lab, Chennai'
    }
  };

  const testParameters = [
    { name: 'Purity', value: `${batchData.testResults.purity}%`, status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Moisture Content', value: `${batchData.testResults.moisture}%`, status: 'Good', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Ash Content', value: `${batchData.testResults.ashContent}%`, status: 'Acceptable', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Acid Insoluble Ash', value: `${batchData.testResults.acidInsoluble}%`, status: 'Good', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Alcohol Extractive', value: `${batchData.testResults.alcoholExtract}%`, status: 'Good', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Water Extractive', value: `${batchData.testResults.waterExtract}%`, status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </button>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-600">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{batchData.id}</h1>
              <p className="text-xl text-gray-600 mb-1">{batchData.productName}</p>
              <p className="text-sm text-gray-500">Quantity: {batchData.quantity}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-white">{batchData.grade}</span>
              </div>
              <span className="text-xs text-gray-500">Grade</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Test Results */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FlaskConical className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Test Results</h2>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {testParameters.map((param, index) => (
                <div key={index} className={`p-4 ${param.bg} rounded-lg border border-opacity-20`}>
                  <p className="text-sm text-gray-600 mb-1">{param.name}</p>
                  <p className="text-xl font-bold text-gray-800">{param.value}</p>
                  <p className={`text-xs font-semibold mt-1 ${param.color}`}>{param.status}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Allocation Summary */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Allocation Summary</h2>
            </div>
            <div className="space-y-3">
              {batchData.allocations.map((allocation, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{allocation.manufacturer}</p>
                      <p className="text-sm text-gray-600">{allocation.purpose}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      allocation.status === 'Allocated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {allocation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">Quantity: <span className="font-semibold">{allocation.quantity}</span></p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Certificate Info */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-md sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Certificate</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <p className="text-center text-sm text-gray-600 mb-1">Certificate Number</p>
                <p className="text-center font-bold text-gray-800">{batchData.testCertificate.certificateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Issued Date</p>
                <p className="font-semibold text-gray-800">{batchData.testCertificate.issuedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Valid Until</p>
                <p className="font-semibold text-gray-800">{batchData.testCertificate.validUntil}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Issued By</p>
                <p className="font-semibold text-gray-800">{batchData.testCertificate.labName}</p>
              </div>
              <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold">
                <Download className="w-5 h-5" />
                Download Certificate
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ApprovedByLabDetail;
