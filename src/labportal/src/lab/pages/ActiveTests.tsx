import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FlaskConical, User, Calendar, Activity, Package } from 'lucide-react';

interface ActiveTestsProps {
  batches: any[];
}

// Mock active tests data
const mockActiveTests = [
  {
    id: 'BATCH-003',
    productName: 'Ginger Root',
    farmerName: 'Vijay Sharma',
    collectionDate: '2024-01-14',
    status: 'TESTING',
    testProgress: 65,
    estimatedCompletion: '30 mins',
    location: 'Kerala'
  },
  {
    id: 'BATCH-006',
    productName: 'Amla',
    farmerName: 'Meera Devi',
    collectionDate: '2024-01-16',
    status: 'TESTING',
    testProgress: 40,
    estimatedCompletion: '1 hour',
    location: 'Rajasthan'
  },
  {
    id: 'BATCH-011',
    productName: 'Moringa',
    farmerName: 'Suresh Reddy',
    collectionDate: '2024-01-19',
    status: 'TESTING',
    testProgress: 80,
    estimatedCompletion: '15 mins',
    location: 'Andhra Pradesh'
  }
];

export function ActiveTests({ batches }: ActiveTestsProps) {
  // Use mock data if no active tests from blockchain
  const activeTests = batches.filter(b => b.status === 'TESTING').length > 0
    ? batches.filter(b => b.status === 'TESTING')
    : mockActiveTests;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-6'
      >
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-3 bg-blue-600 rounded-xl'>
            <Activity className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Active Tests</h1>
            <p className='text-gray-600'>Batches currently undergoing quality testing</p>
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
            <Activity className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Total Active</span>
          </div>
          <p className='text-2xl font-bold text-gray-800'>{activeTests.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <FlaskConical className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>In Progress</span>
          </div>
          <p className='text-2xl font-bold text-blue-600'>{activeTests.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Clock className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Avg. Time</span>
          </div>
          <p className='text-2xl font-bold text-purple-600'>~45m</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Package className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Priority</span>
          </div>
          <p className='text-2xl font-bold text-orange-600'>1</p>
        </motion.div>
      </div>

      {/* Batch Cards Grid */}
      {activeTests.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <Activity className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Active Tests</h2>
          <p className='text-gray-600 text-lg'>Tests in progress will appear here</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {activeTests.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200'
            >
              {/* Batch Header */}
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900'>{batch.id}</h3>
                  <p className='text-lg text-gray-700 font-medium'>{batch.productName}</p>
                </div>
                <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold'>
                  Testing
                </span>
              </div>

              {/* Batch Details */}
              <div className='space-y-3 mb-4'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-sm'>Started: {new Date(batch.collectionDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <User className='w-4 h-4' />
                  <span className='text-sm'>From: {batch.farmerName}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Clock className='w-4 h-4' />
                  <span className='text-sm'>Est. Completion: {batch.estimatedCompletion || '45 mins'}</span>
                </div>
              </div>

              {/* Progress Bar (if available) */}
              {batch.testProgress && (
                <div className='mb-4'>
                  <div className='flex items-center justify-between text-sm text-gray-600 mb-2'>
                    <span>Test Progress</span>
                    <span className='font-semibold'>{batch.testProgress}%</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div 
                      className='bg-blue-600 h-2 rounded-full transition-all duration-500'
                      style={{ width: `${batch.testProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = `/lab/form/${batch.id}`}
                className='w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2'
              >
                <FlaskConical className='w-5 h-5' />
                Continue Testing
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mock Data Indicator */}
      {batches.filter(b => b.status === 'TESTING').length === 0 && (
        <div className='mt-6 text-center'>
          <span className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm font-medium'>
            <Activity className='w-4 h-4' />
            Displaying Mock Data (not on blockchain)
          </span>
        </div>
      )}
    </div>
  );
}
