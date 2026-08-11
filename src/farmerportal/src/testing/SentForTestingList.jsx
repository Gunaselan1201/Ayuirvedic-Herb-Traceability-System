import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FlaskConical, MapPin, Calendar, Package, TrendingUp, Truck, Clock } from 'lucide-react';
import { getEvents } from '../lib/blockchainService';

const SentForTestingList = ({ onBack, onViewDetails, t, farmerId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, inTransit: 0, testing: 0, awaiting: 0 });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const ledgerData = await getEvents();

        // Build batch map to track all stages
        const batchMap = new Map();
        for (const event of ledgerData) {
          const existing = batchMap.get(event.batchId) || {};
          if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
          if (event.stage === 'lab') existing.lab = existing.lab ?? event;
          if (event.stage === 'manufacturer') existing.manufacturer = existing.manufacturer ?? event;
          batchMap.set(event.batchId, existing);
        }

        // Filter for batches belonging to this farmer that have NOT been tested yet
        const fid = farmerId || 'F-00123';
        const pendingBatches = [];

        for (const [batchId, stages] of batchMap.entries()) {
          // Must have farmer stage
          if (!stages.farmer) continue;

          const farmerData = stages.farmer.data || {};
          const addedByMatch = String(stages.farmer.addedBy || '').trim() === String(fid).trim();
          const dataFarmerMatch = String(farmerData.farmerId || '').trim() === String(fid).trim();
          
          // Check if belongs to this farmer
          if (!addedByMatch && !dataFarmerMatch) continue;

          // ONLY include if NO lab stage exists (not tested yet)
          if (!stages.lab) {
            pendingBatches.push({
              batchId,
              farmer: stages.farmer,
              farmerData
            });
          }
        }

        // Transform to display format from blockchain data
        const transformedBatches = pendingBatches.map(batch => ({
          id: batch.batchId,
          productName: batch.farmerData.productName || 'Unknown',
          dateSent: new Date(batch.farmer.timestamp).toLocaleDateString('en-GB'),
          status: 'Sent for Testing',
          location: batch.farmerData.location || 'Unknown Location',
          statusColor: 'bg-blue-100 text-blue-700',
          quantity: batch.farmerData.quantity || 'N/A'
        }));

        setBatches(transformedBatches);
        setStats({
          total: transformedBatches.length,
          inTransit: 0,
          testing: 0,
          awaiting: transformedBatches.length
        });
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]);
        setStats({
          total: 0,
          inTransit: 0,
          testing: 0,
          awaiting: 0
        });
      }
      setLoading(false);
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, [farmerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-600 rounded-xl">
            <FlaskConical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Sent for Testing</h1>
            <p className="text-gray-600">Batches currently in laboratory testing</p>
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
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Total Batches</span>
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
            <Truck className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-500">In Transit</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{loading ? '...' : stats.inTransit}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-500">Testing</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{loading ? '...' : stats.testing}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">Awaiting</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{loading ? '...' : stats.awaiting}</p>
        </motion.div>
      </div>

      {/* Batches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-gray-500">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">No batches sent for testing yet</div>
        ) : null}
        {batches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onViewDetails(batch.id)}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-500"
          >
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Sent: {batch.dateSent}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span>Quantity: {batch.quantity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{batch.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View Details
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SentForTestingList;
