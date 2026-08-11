import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Upload, Calendar, User } from 'lucide-react';

interface TestNewBatchProps {
  batches: any[];
  onSubmit: (batchId: string, data: any) => void;
}

export function TestNewBatch({ batches, onSubmit }: TestNewBatchProps) {
  const navigate = useNavigate();
  
  // Use only blockchain data
  const pendingBatches = batches.filter(b => b.status === 'PENDING');
  const allBatches = batches;
  
  const [selectedBatch, setSelectedBatch] = useState('');

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6'>
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
          <div className='p-3 bg-orange-400 rounded-xl'>
            <FlaskConical className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Pending Tests</h1>
            <p className='text-gray-600'>Batches currently awaiting quality testing</p>
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
            <FlaskConical className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Total Batches</span>
          </div>
          <p className='text-2xl font-bold text-gray-800'>{pendingBatches.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Upload className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>In Transit</span>
          </div>
          <p className='text-2xl font-bold text-blue-600'>2</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <FlaskConical className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Testing</span>
          </div>
          <p className='text-2xl font-bold text-purple-600'>4</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className='bg-white rounded-xl p-4 shadow-md'
        >
          <div className='flex items-center gap-2 mb-1'>
            <Calendar className='w-4 h-4 text-gray-500' />
            <span className='text-sm text-gray-500'>Awaiting</span>
          </div>
          <p className='text-2xl font-bold text-orange-500'>2</p>
        </motion.div>
      </div>

      {/* Batch Cards Grid */}
      {pendingBatches.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100'>
          <FlaskConical className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Pending Batches</h2>
          <p className='text-gray-600 text-lg'>All batches have been tested!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {pendingBatches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='bg-white rounded-2xl shadow-md p-6 border-l-4 border-orange-400 hover:shadow-xl transition-shadow duration-200'
            >
              {/* Batch Header */}
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900'>{batch.id}</h3>
                  <p className='text-lg text-gray-700 font-medium'>{batch.productName}</p>
                </div>
                <span className='bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold'>
                  Pending Test
                </span>
              </div>

              {/* Batch Details */}
              <div className='space-y-3 mb-4'>
                <div className='flex items-center gap-2 text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-sm'>Sent: {new Date(batch.collectionDate).toLocaleDateString('en-GB')}</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <User className='w-4 h-4' />
                  <span className='text-sm'>Quantity: 50 Kg</span>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                  <FlaskConical className='w-4 h-4' />
                  <span className='text-sm'>From: {batch.farmerName}</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/lab/test/${batch.id}`)}
                className='w-full bg-gradient-to-r from-orange-400 to-amber-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2'
              >
                <FlaskConical className='w-5 h-5' />
                Start Testing
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Data Message */}
      {pendingBatches.length === 0 && (
        <div className='mt-6 text-center'>
          <span className='inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm font-medium'>
            <FlaskConical className='w-4 h-4' />
            No pending tests available. All batches have been tested.
          </span>
        </div>
      )}
    </div>
  );
}
