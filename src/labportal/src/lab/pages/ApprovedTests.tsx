import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, Package, Award, TrendingUp } from 'lucide-react';

interface ApprovedBatch {
  id: string;
  productName: string;
  approvalDate: string;
  grade: string;
  quantity: string;
  farmerName: string;
  gradeColor: string;
  gradeBg: string;
}

export function ApprovedTests() {
  const [batches, setBatches] = useState<ApprovedBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const resp = await fetch('http://localhost:3001/events');
        if (!resp.ok) throw new Error('Failed to fetch');
        const ledgerData = await resp.json();

        // Build batch map
        const batchMap = new Map();
        for (const event of ledgerData) {
          const existing = batchMap.get(event.batchId) || {};
          if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
          if (event.stage === 'lab') existing.lab = existing.lab ?? event;
          if (event.stage === 'manufacturer') existing.manufacturer = existing.manufacturer ?? event;
          batchMap.set(event.batchId, existing);
        }

        // Filter for approved batches (tested but not sent to manufacturer yet)
        const approvedBatches = [];
        for (const [batchId, stages] of batchMap.entries()) {
          if (!stages.farmer || !stages.lab || stages.manufacturer) continue;

          const farmerData = stages.farmer.data || {};
          const labData = stages.lab.data || {};
          const grade = labData.originalGrade || labData.qualityGrade || labData.quality || 'N/A';
          
          // Check if approved (not rejected)
          const isApproved = labData.approvalStatus !== 'rejected' && 
                            grade !== 'F' && 
                            grade !== 'Rejected';
          
          if (!isApproved) continue;

          // Grade coloring
          const isGradeA = grade === 'A';
          const isGradeB = grade === 'B';
          const isGradeC = grade === 'C';

          approvedBatches.push({
            id: batchId,
            productName: farmerData.productName || 'Unknown',
            approvalDate: new Date(stages.lab.timestamp).toLocaleDateString('en-GB'),
            grade: grade,
            quantity: farmerData.quantity || 'N/A',
            farmerName: farmerData.farmerId || stages.farmer.addedBy || 'Unknown',
            gradeColor: isGradeA ? 'text-green-600' : isGradeB ? 'text-blue-600' : isGradeC ? 'text-orange-600' : 'text-gray-600',
            gradeBg: isGradeA ? 'bg-green-50' : isGradeB ? 'bg-blue-50' : isGradeC ? 'bg-orange-50' : 'bg-gray-50'
          });
        }

        // Calculate stats
        const gradeACount = approvedBatches.filter(b => b.grade === 'A').length;
        const gradeBCount = approvedBatches.filter(b => b.grade === 'B').length;
        const gradeCCount = approvedBatches.filter(b => b.grade === 'C').length;

        setBatches(approvedBatches);
        setStats({
          total: approvedBatches.length,
          gradeA: gradeACount,
          gradeB: gradeBCount,
          gradeC: gradeCCount
        });
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]);
        setStats({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Approved Tests</h1>
            <p className="text-gray-600">Batches that passed quality testing</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Total Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500">Grade A (Excellent)</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.gradeA}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">Grade B (Good)</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.gradeB}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">Grade C (Acceptable)</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{loading ? '...' : stats.gradeC}</p>
        </motion.div>
      </div>

      {/* Batches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No approved batches waiting for manufacturing</p>
          </div>
        ) : null}
        {batches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-green-500"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{batch.id}</h3>
                <p className="text-sm text-gray-600">{batch.productName}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Approved
              </span>
            </div>

            <div className="space-y-2">
              <div className={`p-3 ${batch.gradeBg} rounded-lg`}>
                <p className="text-xs text-gray-600 mb-1">Quality Grade</p>
                <p className={`text-2xl font-bold ${batch.gradeColor}`}>{batch.grade}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Approved: {batch.approvalDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Quantity: {batch.quantity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Farmer: {batch.farmerName}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-blue-600 font-medium">
                Ready for Manufacturing
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
