import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, Search, Filter, Calendar, User, Award, ArrowLeft, Factory } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../../lib/blockchainService';

interface AllBatchesProps {
  batches: any[];
  onSelect: (id: string) => void;
}

export function AllBatches({ batches, onSelect }: AllBatchesProps) {
  const navigate = useNavigate();
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const ledgerData = await getEvents();

        // Filter for manufacturer stage (completed orders)
        const manufacturingBatches = ledgerData.filter((entry: any) => 
          entry && entry.stage === 'manufacturer'
        );

        // Transform from real data
        const transformedBatches = manufacturingBatches.map((entry: any) => ({
          id: entry.batchId,
          productName: entry.data?.productName || 'Unknown',
          manufacturer: entry.data?.manufacturerName || 'Unknown Manufacturer',
          dateSent: new Date(entry.timestamp).toLocaleDateString('en-GB'),
          status: 'Sent to Manufacturing',
          quantity: entry.data?.quantity || 'N/A',
          grade: entry.data?.qualityGrade || 'N/A'
        }));
        setCompletedOrders(transformedBatches);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
        setCompletedOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  const gradeACount = completedOrders.filter(b => b.grade === 'A').length;
  const gradeBCount = completedOrders.filter(b => b.grade === 'B').length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 p-6'>
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
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          <span className='font-medium'>Back</span>
        </motion.button>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-3 bg-purple-600 rounded-xl'>
            <Factory className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Completed Orders</h1>
            <p className='text-gray-600'>Batches sent to manufacturing companies</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Factory className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Total Orders</span>
          </div>
          <p className='text-2xl font-bold text-gray-800'>{loading ? '...' : completedOrders.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Award className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Grade A</span>
          </div>
          <p className='text-2xl font-bold text-green-600'>{gradeACount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Award className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Grade B</span>
          </div>
          <p className='text-2xl font-bold text-blue-600'>{gradeBCount}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <CheckCircle className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Accepted</span>
          </div>
          <p className='text-2xl font-bold text-purple-600'>{completedOrders.length}</p>
        </motion.div>
      </div>

      {/* Order Cards Grid */}
      {loading ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <Factory className='w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>Loading...</h2>
        </div>
      ) : completedOrders.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <Factory className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Completed Orders</h2>
          <p className='text-gray-600 text-lg'>Orders sent to manufacturing will appear here</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {completedOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-white rounded-2xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200'
            >
              {/* Order Header */}
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900'>{order.id}</h3>
                  <p className='text-lg text-gray-700 font-medium'>{order.productName}</p>
                </div>
                <span className='bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold'>
                  Grade {order.grade}
                </span>
              </div>

              {/* Order Details */}
              <div className='space-y-3 mb-4'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-sm'>Sent: {order.dateSent}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Factory className='w-4 h-4' />
                  <span className='text-sm'>{order.manufacturer}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Package className='w-4 h-4' />
                  <span className='text-sm'>Quantity: {order.quantity}</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(order.id)}
                className='w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2'
              >
                View Details →
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {completedOrders.length === 0 && !loading && (
        <div className='mt-6 text-center'>
          <span className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-medium'>
            <Factory className='w-4 h-4' />
            No completed orders yet. Batches will appear here after manufacturing.
          </span>
        </div>
      )}
    </div>
  );
}
