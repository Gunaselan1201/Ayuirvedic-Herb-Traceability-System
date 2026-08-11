import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, AlertTriangle, Calendar, User, FileText, Package } from 'lucide-react';

interface RejectedBatchesProps {
  batches: any[];
}

export function RejectedBatches({ batches }: RejectedBatchesProps) {
  // Use only blockchain data
  const rejectedBatches = batches.filter(b => b.status === 'REJECTED');

  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-6'>
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
          <div className='p-3 bg-red-600 rounded-xl'>
            <XCircle className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Rejected Batches</h1>
            <p className='text-gray-600'>Batches that failed quality testing standards</p>
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
            <XCircle className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Total Rejected</span>
          </div>
          <p className='text-2xl font-bold text-gray-800'>{rejectedBatches.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <AlertTriangle className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Pesticide</span>
          </div>
          <p className='text-2xl font-bold text-red-600'>1</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <AlertTriangle className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Moisture</span>
          </div>
          <p className='text-2xl font-bold text-orange-600'>1</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Package className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Pass Rate</span>
          </div>
          <p className='text-2xl font-bold text-green-600'>86%</p>
        </motion.div>
      </div>

      {/* Batch Cards Grid */}
      {rejectedBatches.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6'>
            <XCircle className='w-10 h-10 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Rejected Batches</h2>
          <p className='text-gray-600 text-lg mb-2'>All tested batches have passed quality standards!</p>
          <p className='text-gray-500 text-sm'>Rejected batches will appear here with detailed failure reasons</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {rejectedBatches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-white rounded-2xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-200'
            >
              {/* Batch Header */}
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900'>{batch.id}</h3>
                  <p className='text-lg text-gray-700 font-medium'>{batch.productName}</p>
                </div>
                <span className='bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold'>
                  Rejected
                </span>
              </div>

              {/* Batch Details */}
              <div className='space-y-3 mb-4'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-sm'>Rejected: {new Date(batch.rejectedDate || batch.collectionDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <User className='w-4 h-4' />
                  <span className='text-sm'>Rejected By: {batch.rejectedBy || 'Lab QC'}</span>
                </div>
              </div>

              {/* Rejection Reason */}
              <div className='bg-red-50 rounded-lg p-4 border border-red-100 mb-4'>
                <div className='flex items-start gap-2'>
                  <AlertTriangle className='w-4 h-4 text-red-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-xs font-semibold text-red-800 mb-1'>Rejection Reason:</p>
                    <p className='text-sm text-gray-700'>{batch.reason || 'Quality standards not met'}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2'
              >
                View Details →
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {rejectedBatches.length === 0 && (
        <div className='mt-6 text-center'>
          <span className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-medium'>
            <XCircle className='w-4 h-4' />
            No rejected batches. All tested batches have passed quality standards.
          </span>
        </div>
      )}
    </div>
  );
}
