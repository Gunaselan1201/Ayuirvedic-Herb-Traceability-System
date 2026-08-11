import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Factory, Building2, Phone, Mail, MapPin, Package, Award, FileText, AlertTriangle } from 'lucide-react';

const SentToManufacturingDetail = ({ batchId, onBack }) => {
  const batchData = {
    id: batchId || 'TUL-2024-1145',
    productName: 'Tulsi (Holy Basil)',
    quantity: '200 kg',
    dateSent: '2024-10-26',
    status: 'Accepted',
    grade: 'A+',
    manufacturer: {
      name: 'Himalaya Wellness Company',
      address: 'Makali, Bangalore - 562162, Karnataka',
      contact: '+91 80 2374 0585',
      email: 'quality@himalayawellness.com',
      registrationNo: 'MFG-KAR-2024-00567'
    },
    transfer: {
      purpose: 'Herbal Tea Production',
      receivedDate: '2024-10-27',
      inspectionStatus: 'Passed',
      acceptedQuantity: '200 kg',
      gradeVerified: 'A+'
    },
    rejection: null // null if accepted, otherwise contains rejection data
  };

  // Example rejected batch data
  const rejectedBatchExample = {
    rejection: {
      reason: 'Moisture content exceeds acceptable limits',
      rejectedDate: '2024-10-27',
      inspector: 'Dr. Rajesh Kumar',
      gradeEvaluation: 'B- (Downgraded from B+)',
      details: 'Moisture content found to be 12.3% against acceptable limit of 10%. Product shows signs of inadequate drying process.',
      recommendations: 'Improve drying process, ensure proper storage conditions'
    }
  };

  const isRejected = batchData.status === 'Rejected' || batchData.status === 'Failed QC';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </button>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-600">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{batchData.id}</h1>
              <p className="text-xl text-gray-600 mb-1">{batchData.productName}</p>
              <p className="text-sm text-gray-500">Quantity: {batchData.quantity}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isRejected ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {batchData.status}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Manufacturer Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Factory className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Manufacturer Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Company Name</p>
                </div>
                <p className="font-semibold text-gray-800 text-lg">{batchData.manufacturer.name}</p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Address</p>
                </div>
                <p className="font-semibold text-gray-800">{batchData.manufacturer.address}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Contact</p>
                </div>
                <p className="font-semibold text-gray-800">{batchData.manufacturer.contact}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Email</p>
                </div>
                <p className="font-semibold text-gray-800">{batchData.manufacturer.email}</p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Registration Number</p>
                </div>
                <p className="font-semibold text-gray-800">{batchData.manufacturer.registrationNo}</p>
              </div>
            </div>
          </motion.div>

          {/* Transfer Details or Rejection Info */}
          {!isRejected ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Transfer Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Purpose</p>
                  <p className="font-semibold text-gray-800">{batchData.transfer.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Received Date</p>
                  <p className="font-semibold text-gray-800">{batchData.transfer.receivedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Inspection Status</p>
                  <p className="font-semibold text-green-600">{batchData.transfer.inspectionStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Accepted Quantity</p>
                  <p className="font-semibold text-gray-800">{batchData.transfer.acceptedQuantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Grade Verified</p>
                  <p className="font-semibold text-green-600 text-lg">{batchData.transfer.gradeVerified}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-red-50 rounded-xl p-6 shadow-md border-2 border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-red-800">Rejection Details</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-red-600 mb-1">Reason for Rejection</p>
                  <p className="font-semibold text-red-800">{rejectedBatchExample.rejection.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-red-600 mb-1">Rejected Date</p>
                    <p className="font-semibold text-red-800">{rejectedBatchExample.rejection.rejectedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-red-600 mb-1">Inspector</p>
                    <p className="font-semibold text-red-800">{rejectedBatchExample.rejection.inspector}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-red-600 mb-1">Grade Evaluation</p>
                  <p className="font-semibold text-red-800">{rejectedBatchExample.rejection.gradeEvaluation}</p>
                </div>
                <div>
                  <p className="text-sm text-red-600 mb-1">Details</p>
                  <p className="text-red-800">{rejectedBatchExample.rejection.details}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 mb-1 font-semibold">Recommendations</p>
                  <p className="text-sm text-yellow-800">{rejectedBatchExample.rejection.recommendations}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Grade Info */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-md sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Grade Information</h2>
            </div>
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3">
                <span className="text-4xl font-bold text-white">{batchData.grade}</span>
              </div>
              <p className="text-sm text-gray-600">Allocated Grade</p>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Batch ID</p>
                <p className="font-semibold text-gray-800">{batchData.id}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Product</p>
                <p className="font-semibold text-gray-800">{batchData.productName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Quantity Sent</p>
                <p className="font-semibold text-gray-800">{batchData.quantity}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Date Sent</p>
                <p className="font-semibold text-gray-800">{batchData.dateSent}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SentToManufacturingDetail;
