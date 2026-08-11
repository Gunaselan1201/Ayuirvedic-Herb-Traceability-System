import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Package, User, Calendar, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActiveBatch {
  id: string;
  productName: string;
  startDate: string;
  status: string;
  quantity: string;
  farmerName: string;
  grade: string;
  daysInProduction: number;
}

export function ManufacturerActiveBatches() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<ActiveBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, avgDays: 0 });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const resp = await fetch('http://localhost:3001/events');
        if (!resp.ok) throw new Error('Failed to fetch');
        const ledgerData = await resp.json();

        const batchMap = new Map();
        for (const event of ledgerData) {
          const existing = batchMap.get(event.batchId) || {};
          if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
          if (event.stage === 'lab') existing.lab = existing.lab ?? event;
          if (event.stage === 'manufacturer') existing.manufacturer = existing.manufacturer ?? event;
          batchMap.set(event.batchId, existing);
        }

        const activeBatches: ActiveBatch[] = [];
        let totalDays = 0;

        for (const [batchId, stages] of batchMap.entries()) {
          const { farmer, lab, manufacturer } = stages;
          const status = manufacturer?.data?.status || '';
          
          if (manufacturer && (status === 'In Production' || status === 'Processing')) {
            const startDate = new Date(manufacturer.timestamp);
            const daysInProduction = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            totalDays += daysInProduction;

            activeBatches.push({
              id: batchId,
              productName: farmer?.data?.productName || 'Unknown',
              startDate: startDate.toLocaleDateString('en-GB'),
              status,
              quantity: `${farmer?.data?.quantityValue || '0'} ${farmer?.data?.quantityUnit || 'Kg'}`,
              farmerName: farmer?.data?.farmerName || 'Unknown Farmer',
              grade: lab?.data?.qualityGrade || 'N/A',
              daysInProduction
            });
          }
        }

        activeBatches.sort((a, b) => b.daysInProduction - a.daysInProduction);

        setBatches(activeBatches);
        setStats({ 
          total: activeBatches.length, 
          avgDays: activeBatches.length > 0 ? Math.round(totalDays / activeBatches.length) : 0 
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6'>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-6'>
        <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/dashboard')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors'
          aria-label='Back to dashboard'
          title='Back to dashboard'
        >
          <ArrowLeft className='w-5 h-5' />
          <span className='font-medium'>Back to Dashboard</span>
        </motion.button>

        <div className='flex items-center gap-3 mb-2'>
          <div className='p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl'>
            <Clock className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Active Batches</h1>
            <p className='text-gray-600'>Currently in production</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        {[
          { label: 'Active Batches', value: stats.total, color: 'amber', icon: Activity },
          { label: 'Avg Days in Production', value: stats.avgDays, color: 'orange', icon: TrendingUp }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${stat.color}-500`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>{stat.label}</p>
                <h3 className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</h3>
              </div>
              <stat.icon className={`w-12 h-12 text-${stat.color}-500`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center'>
          <Clock className='w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>Loading...</h2>
        </div>
      ) : batches.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center'>
          <Clock className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Active Batches</h2>
          <p className='text-gray-600 text-lg'>Batches in production will appear here</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {batches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className='bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-amber-500'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-bold text-gray-800'>{batch.id}</h3>
                  <p className='text-sm text-gray-500'>{batch.productName}</p>
                </div>
                <span className='px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700'>
                  Grade {batch.grade}
                </span>
              </div>

              <div className='space-y-2 mb-4'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Package className='w-4 h-4' />
                  <span>{batch.quantity}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <User className='w-4 h-4' />
                  <span>{batch.farmerName}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span>Started: {batch.startDate}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Clock className='w-4 h-4' />
                  <span>{batch.daysInProduction} days in production</span>
                </div>
              </div>

              <div className='pt-3 border-t border-gray-200'>
                <div className='flex items-center gap-2'>
                  <span className='inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium'>
                    {batch.status}
                  </span>
                  <Activity className='w-4 h-4 text-amber-500 animate-pulse' />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
