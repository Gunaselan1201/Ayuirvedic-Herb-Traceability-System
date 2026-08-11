import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Factory, Package, Calendar, Award } from 'lucide-react';

export function LabSentToManufacturing() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const resp = await fetch('http://localhost:3001/events');
        if (!resp.ok) throw new Error('Failed to fetch');
        const ledgerData = await resp.json();

        // Build batch map to track all stages
        const batchMap = new Map();
        for (const event of ledgerData) {
          const existing = batchMap.get(event.batchId) || {};
          if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
          if (event.stage === 'lab') existing.lab = existing.lab ?? event;
          if (event.stage === 'manufacturer') existing.manufacturer = existing.manufacturer ?? event;
          batchMap.set(event.batchId, existing);
        }

        // Filter for batches that reached manufacturing stage
        const manufacturingBatches = [];

        for (const [batchId, stages] of batchMap.entries()) {
          // Must have farmer, lab (approved), and manufacturer stages
          if (!stages.farmer || !stages.lab || !stages.manufacturer) continue;

          const farmerData = stages.farmer.data || {};
          const labData = stages.lab.data || {};
          const manufacturerData = stages.manufacturer.data || {};
          
          // Only include if approved (not rejected) and sent to manufacturer
          const isApproved = labData.approvalStatus !== 'rejected' && 
                            labData.qualityGrade !== 'F' && 
                            labData.qualityGrade !== 'Rejected';
          
          if (isApproved) {
            const grade = labData.originalGrade || labData.qualityGrade || 'N/A';
            
            manufacturingBatches.push({
              id: batchId,
              productName: farmerData.productName || 'Unknown',
              dateSent: new Date(stages.manufacturer.timestamp).toLocaleDateString('en-GB'),
              manufacturer: manufacturerData.companyName || manufacturerData.manufacturerName || 'Unknown Manufacturer',
              quantity: farmerData.quantity || 'N/A',
              unit: farmerData.unit || '',
              grade: grade,
              gradeColor: grade === 'A' ? 'text-green-600' : grade === 'B' ? 'text-blue-600' : grade === 'C' ? 'text-orange-600' : 'text-gray-600',
              gradeBg: grade === 'A' ? 'bg-green-50' : grade === 'B' ? 'bg-blue-50' : grade === 'C' ? 'bg-orange-50' : 'bg-gray-50'
            });
          }
        }

        // Calculate stats
        const gradeACount = manufacturingBatches.filter(b => b.grade === 'A').length;
        const gradeBCount = manufacturingBatches.filter(b => b.grade === 'B').length;
        const gradeCCount = manufacturingBatches.filter(b => b.grade === 'C').length;

        setBatches(manufacturingBatches);
        setStats({
          total: manufacturingBatches.length,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-600 rounded-xl">
            <Factory className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Sent to Manufacturing</h1>
            <p className="text-gray-600">Approved batches forwarded to manufacturing units</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Total Sent</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.total}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500">Grade A</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.gradeA}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">Grade B</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.gradeB}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">Grade C</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{loading ? '...' : stats.gradeC}</p>
        </motion.div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">Loading manufacturing batches...</div>
        ) : batches.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            <Factory className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No batches sent to manufacturing yet</p>
          </div>
        ) : null}
        {batches.map((batch, index) => (
          <motion.div 
            key={batch.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.03 }} 
            whileHover={{ scale: 1.02 }} 
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-purple-500"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{batch.id}</h3>
                <p className="text-sm text-gray-600">{batch.productName}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                In Manufacturing
              </span>
            </div>

            <div className="space-y-2">
              <div className={`p-3 ${batch.gradeBg} rounded-lg`}>
                <p className="text-xs text-gray-600 mb-1">Quality Grade</p>
                <p className={`text-2xl font-bold ${batch.gradeColor}`}>{batch.grade}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Sent: {batch.dateSent}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Quantity: {batch.quantity} {batch.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Factory className="w-4 h-4" />
                <span className="font-medium">{batch.manufacturer}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
