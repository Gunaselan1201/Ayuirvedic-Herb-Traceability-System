import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, XCircle, AlertTriangle, FileText, User, Calendar, Award } from 'lucide-react';

const RejectedFailedDetail = ({ batchId, onBack }) => {
  const batchData = {
    id: batchId || 'TUR-2024-0667',
    productName: 'Turmeric',
    quantity: '580 kg',
    rejectedDate: '2024-10-22',
    grade: 'B',
    rejection: {
      reason: 'Moisture content exceeds acceptable limits',
      rejectedBy: 'Manufacturing Quality Control',
      inspector: 'Dr. Rajesh Kumar',
      inspectorId: 'QC-MH-2024-089',
      details: 'During quality inspection at the manufacturing facility, the batch was found to have a moisture content of 12.3%, which exceeds the acceptable limit of 10% for Grade B classification. This high moisture content may lead to fungal growth and product degradation during storage.',
      recommendations: [
        'Improve the drying process to achieve optimal moisture levels',
        'Ensure proper storage conditions before dispatch',
        'Consider implementing quality checks before sending to manufacturer',
        'Review harvest timing and post-harvest handling procedures'
      ],
      gradeEvaluation: {
        original: 'B',
        evaluated: 'B- (Downgraded)',
        purityLevel: '88.5%',
        moistureContent: '12.3%',
        contaminationLevel: 'Low'
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </button>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-red-600">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{batchData.id}</h1>
              <p className="text-xl text-gray-600 mb-1">{batchData.productName}</p>
              <p className="text-sm text-gray-500">Quantity: {batchData.quantity}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-2">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs text-red-600 font-semibold">REJECTED</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Rejection Reason */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-red-50 rounded-xl p-6 shadow-md border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-800">Rejection Reason</h2>
            </div>
            <div className="p-4 bg-white rounded-lg border border-red-200 mb-4">
              <p className="text-lg font-semibold text-red-800">{batchData.rejection.reason}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Detailed Explanation:</p>
              <p className="text-gray-800">{batchData.rejection.details}</p>
            </div>
          </motion.div>

          {/* Grade Evaluation Report */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Grade Evaluation Report</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Original Grade</p>
                <p className="text-2xl font-bold text-gray-800">{batchData.rejection.gradeEvaluation.original}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 mb-1">Evaluated Grade</p>
                <p className="text-2xl font-bold text-red-700">{batchData.rejection.gradeEvaluation.evaluated}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Purity Level</p>
                <p className="text-lg font-semibold text-gray-800">{batchData.rejection.gradeEvaluation.purityLevel}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-600 mb-1">Moisture Content</p>
                <p className="text-lg font-semibold text-red-700">{batchData.rejection.gradeEvaluation.moistureContent}</p>
              </div>
              <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Contamination Level</p>
                <p className="text-lg font-semibold text-gray-800">{batchData.rejection.gradeEvaluation.contaminationLevel}</p>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-yellow-50 rounded-xl p-6 shadow-md border-2 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-yellow-800">Recommendations for Improvement</h2>
            </div>
            <ul className="space-y-2">
              {batchData.rejection.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-800">{rec}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Inspector Info */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-md sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Inspector Details</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Inspector Name</p>
                <p className="font-semibold text-gray-800">{batchData.rejection.inspector}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Inspector ID</p>
                <p className="font-semibold text-gray-800">{batchData.rejection.inspectorId}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Rejected By</p>
                <p className="font-semibold text-gray-800">{batchData.rejection.rejectedBy}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Rejection Date</p>
                <p className="font-semibold text-gray-800">{batchData.rejectedDate}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                  Request Re-evaluation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RejectedFailedDetail;
