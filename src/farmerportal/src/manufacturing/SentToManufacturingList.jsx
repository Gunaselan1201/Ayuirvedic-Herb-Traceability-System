import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Factory, Package, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const SentToManufacturingList = ({ onBack, onViewDetails, t, farmerId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, accepted: 0, processing: 0, rejected: 0 });

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

        // Filter for batches belonging to this farmer that reached manufacturing
        const fid = farmerId || 'F-00123';
        const manufacturingBatches = [];

        for (const [batchId, stages] of batchMap.entries()) {
          // Must have farmer, lab (approved), and manufacturer stages
          if (!stages.farmer || !stages.lab || !stages.manufacturer) continue;

          const farmerData = stages.farmer.data || {};
          const labData = stages.lab.data || {};
          const manufacturerData = stages.manufacturer.data || {};
          
          const addedByMatch = String(stages.farmer.addedBy || '').trim() === String(fid).trim();
          const dataFarmerMatch = String(farmerData.farmerId || '').trim() === String(fid).trim();
          
          // Check if belongs to this farmer
          if (!addedByMatch && !dataFarmerMatch) continue;

          // Only include if approved (not rejected) and sent to manufacturer
          const isApproved = labData.approvalStatus !== 'rejected' && 
                            labData.qualityGrade !== 'F' && 
                            labData.qualityGrade !== 'Rejected';
          
          if (isApproved) {
            manufacturingBatches.push({
              batchId,
              farmer: stages.farmer,
              lab: stages.lab,
              manufacturer: stages.manufacturer,
              farmerData,
              labData,
              manufacturerData
            });
          }
        }

        // Transform to display format
        const transformedBatches = manufacturingBatches.map(batch => ({
          id: batch.batchId,
          productName: batch.farmerData.productName || 'Unknown',
          dateSent: new Date(batch.manufacturer.timestamp).toLocaleDateString('en-GB'),
          manufacturer: batch.manufacturerData.companyName || 'Unknown Manufacturer',
          status: 'Sent to Manufacturing',
          statusColor: 'bg-purple-100 text-purple-700',
          quantity: batch.farmerData.quantity || 'N/A',
          grade: batch.labData.originalGrade || batch.labData.qualityGrade || 'N/A'
        }));

        setBatches(transformedBatches);
        setStats({
          total: transformedBatches.length,
          accepted: 0,
          processing: transformedBatches.length,
          rejected: 0
        });
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]);
        setStats({
          total: 0,
          accepted: 0,
          processing: 1,
          rejected: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, [farmerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-600 rounded-xl">
            <Factory className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t ? t('sentToManufacturing') : 'Sent to Manufacturing'}</h1>
            <p className="text-gray-600">{t ? t('batchesForwarded') : 'Batches forwarded to manufacturing units'}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">{t ? t('total') : 'Total'}</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.total}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-500">{t ? t('accepted') : 'Accepted'}</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.accepted}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-500">{t ? t('processing') : 'Processing'}</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{loading ? '...' : stats.processing}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-500">{t ? t('rejected') : 'Rejected'}</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{loading ? '...' : stats.rejected}</p>
        </motion.div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">{t ? t('loadingBatches') : 'Loading manufacturing batches...'}</div>
        ) : batches.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">{t ? t('noBatchesSent') : 'No batches sent to manufacturing yet'}</div>
        ) : null}
        {batches.map((batch, index) => (
          <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ scale: 1.02 }} onClick={() => onViewDetails(batch.id)} className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-purple-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{batch.id}</h3>
                <p className="text-sm text-gray-600">{batch.productName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${batch.statusColor}`}>
                {batch.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Manufacturer:</span>
                <span className="font-semibold text-gray-800 text-right">{batch.manufacturer}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Date Sent:</span>
                <span className="font-semibold text-gray-800">{batch.dateSent}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold text-gray-800">{batch.quantity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Grade:</span>
                <span className="font-semibold text-green-600">{batch.grade}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SentToManufacturingList;
