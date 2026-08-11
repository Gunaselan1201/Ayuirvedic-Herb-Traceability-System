import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Calendar, Package, Award, TrendingUp, User } from 'lucide-react';

interface CompletedOrder {
  id: string;
  productName: string;
  completedDate: string;
  grade: string;
  quantity: string;
  farmerName: string;
  manufacturerName: string;
  gradeColor: string;
  gradeBg: string;
}

export function ManufacturerCompletedOrders() {
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });

  useEffect(() => {
    const fetchOrders = async () => {
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

        // Filter batches that have manufacturer stage (completed)
        const completedOrders: CompletedOrder[] = [];
        let gradeACount = 0;
        let gradeBCount = 0;
        let gradeCCount = 0;

        for (const [batchId, stages] of batchMap.entries()) {
          const { farmer, lab, manufacturer } = stages;
          
          // Only show batches that have been processed by manufacturer
          if (manufacturer && lab?.data?.qualityGrade) {
            const grade = lab.data.qualityGrade;
            if (grade === 'A') gradeACount++;
            else if (grade === 'B') gradeBCount++;
            else if (grade === 'C') gradeCCount++;

            const gradeColors: any = {
              'A': { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-500' },
              'B': { color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-500' },
              'C': { color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-500' }
            };

            completedOrders.push({
              id: batchId,
              productName: farmer?.data?.productName || 'Unknown',
              completedDate: new Date(manufacturer.timestamp).toLocaleDateString('en-GB'),
              grade,
              quantity: `${farmer?.data?.quantityValue || '0'} ${farmer?.data?.quantityUnit || 'Kg'}`,
              farmerName: farmer?.data?.farmerName || 'Unknown Farmer',
              manufacturerName: manufacturer?.data?.manufacturerName || 'Manufacturer',
              gradeColor: gradeColors[grade]?.color || 'text-gray-700',
              gradeBg: gradeColors[grade]?.bg || 'bg-gray-100',
            });
          }
        }

        // Sort by completion date (newest first)
        completedOrders.sort((a, b) => 
          new Date(b.completedDate.split('/').reverse().join('-')).getTime() - 
          new Date(a.completedDate.split('/').reverse().join('-')).getTime()
        );

        setOrders(completedOrders);
        setStats({
          total: completedOrders.length,
          gradeA: gradeACount,
          gradeB: gradeBCount,
          gradeC: gradeCCount,
        });
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-6'
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors'
        >
          <ArrowLeft className='w-5 h-5' />
          <span className='font-medium'>Back</span>
        </motion.button>

        <div className='flex items-center gap-3 mb-2'>
          <div className='p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl'>
            <CheckCircle className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Completed Orders</h1>
            <p className='text-gray-600'>Successfully manufactured products</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>Total Completed</p>
              <h3 className='text-3xl font-bold text-gray-900'>{stats.total}</h3>
            </div>
            <CheckCircle className='w-12 h-12 text-green-500' />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>Grade A</p>
              <h3 className='text-3xl font-bold text-green-700'>{stats.gradeA}</h3>
            </div>
            <Award className='w-12 h-12 text-green-500' />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>Grade B</p>
              <h3 className='text-3xl font-bold text-blue-700'>{stats.gradeB}</h3>
            </div>
            <Award className='w-12 h-12 text-blue-500' />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500'
        >
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>Grade C</p>
              <h3 className='text-3xl font-bold text-amber-700'>{stats.gradeC}</h3>
            </div>
            <Award className='w-12 h-12 text-amber-500' />
          </div>
        </motion.div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <CheckCircle className='w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>Loading Completed Orders...</h2>
        </div>
      ) : orders.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <CheckCircle className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Completed Orders</h2>
          <p className='text-gray-600 text-lg'>Manufactured products will appear here</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className='bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border-l-4 border-green-500'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-bold text-gray-800'>{order.id}</h3>
                  <p className='text-sm text-gray-500'>{order.productName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.gradeBg} ${order.gradeColor}`}>
                  Grade {order.grade}
                </span>
              </div>

              <div className='space-y-2 mb-4'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Package className='w-4 h-4' />
                  <span>{order.quantity}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <User className='w-4 h-4' />
                  <span>{order.farmerName}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span>Completed: {order.completedDate}</span>
                </div>
              </div>

              <div className='pt-3 border-t border-gray-200 flex items-center gap-2'>
                <CheckCircle className='w-4 h-4 text-green-600' />
                <span className='text-xs font-medium text-green-700'>Manufacturing Complete</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
