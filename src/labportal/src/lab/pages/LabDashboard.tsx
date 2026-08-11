import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TestTube, CheckCircle, XCircle, Activity } from 'lucide-react';
import type { LabBatch } from '../../../../types';
import { fetchTestedBatches } from '../../api';
import { getEvents } from '../../lib/blockchainService';

export function LabDashboard({
  batches,
  onSelect,
}: {
  batches: LabBatch[];
  onSelect: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [testedBatches, setTestedBatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [manufacturingCount, setManufacturingCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tested = await fetchTestedBatches();
        setTestedBatches(tested);
      } catch (error) {
        console.error('Error fetching tested batches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch manufacturing-stage events count (completed orders) so dashboard and farmer portal match
  useEffect(() => {
    let mounted = true;
    const fetchManufacturing = async () => {
      try {
        const events = await getEvents();
        const mCount = events.filter(e => e && e.stage === 'manufacturer').length;
        if (mounted) setManufacturingCount(mCount);
      } catch (err) {
        if (mounted) setManufacturingCount(0);
      }
    };

    fetchManufacturing();
    const iv = setInterval(fetchManufacturing, 30000);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  // Fetch real blockchain data with auto-refresh
  useEffect(() => {
    // Trigger parent to reload if needed - batches prop will update
    const interval = setInterval(() => {
      // Force a re-render to check for updates
      setLoading(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [batches]);

  // Use only blockchain data
  const allBatches = batches;

  // Filter batches by status - status is already correctly set in LabApp.tsx
  const pending = allBatches.filter((b) => b.status === 'PENDING');
  const completed = allBatches.filter((b) => b.status === 'TESTED');
  const rejected = allBatches.filter((b) => b.status === 'REJECTED');

  // Calculate approved count (tested but not rejected and not sent to manufacturer)
  const [approvedCount, setApprovedCount] = useState<number>(0);
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const events = await getEvents();
        const batchMap = new Map();
        for (const event of events) {
          const existing = batchMap.get(event.batchId) || {};
          if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
          if (event.stage === 'lab') existing.lab = existing.lab ?? event;
          if (event.stage === 'manufacturer') existing.manufacturer = existing.manufacturer ?? event;
          batchMap.set(event.batchId, existing);
        }
        
        let approved = 0;
        for (const [batchId, stages] of batchMap.entries()) {
          if (stages.farmer && stages.lab && !stages.manufacturer) {
            const labData = stages.lab.data || {};
            const grade = labData.originalGrade || labData.qualityGrade || labData.quality || 'N/A';
            const isApproved = labData.approvalStatus !== 'rejected' && grade !== 'F' && grade !== 'Rejected';
            if (isApproved) approved++;
          }
        }
        setApprovedCount(approved);
      } catch (err) {
        setApprovedCount(0);
      }
    };
    fetchApproved();
    const iv = setInterval(fetchApproved, 10000);
    return () => clearInterval(iv);
  }, []);

  // Tab configuration
  const tabs = [
    { 
      label: 'Pending Tests', 
      count: pending.length, 
      icon: TestTube, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-amber-600',
      borderColor: 'border-orange-500',
      hoverBg: 'hover:bg-orange-50',
      route: '/lab/test-new'
    },
    { 
      label: 'Approved Tests', 
      count: approvedCount, 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-600',
      borderColor: 'border-green-500',
      hoverBg: 'hover:bg-green-50',
      route: '/lab/approved'
    },
    { 
      label: 'Sent to Manufacturer', 
      count: manufacturingCount, 
      icon: CheckCircle, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-indigo-600',
      borderColor: 'border-purple-500',
      hoverBg: 'hover:bg-purple-50',
      route: '/lab/manufacturer'
    },
    { 
      label: 'Rejected Batches', 
      count: rejected.length, 
      icon: XCircle, 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-orange-600',
      borderColor: 'border-red-500',
      hoverBg: 'hover:bg-red-50',
      route: '/lab/rejected'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.6, -0.05, 0.01, 0.99] as any
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='min-h-screen bg-white p-6'
    >
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <motion.div 
          variants={cardVariants}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Welcome back, Ravi Kumar
          </h1>
          <p className='text-gray-600'>
            Monitor and manage your herb batches throughout the supply chain
          </p>
        </motion.div>

        {/* Summary Stats Row - 3 Cards */}
        <motion.div 
          variants={cardVariants}
          className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'
        >
          {/* Total Batches */}
          <div className='bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 font-medium'>Total Batches</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>{loading ? '...' : allBatches.length}</p>
              </div>
              <div className='bg-indigo-100 p-3 rounded-full'>
                <Activity className='w-6 h-6 text-indigo-600' />
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div className='bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 font-medium'>Success Rate</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>
                  {loading ? '...' : `${allBatches.length > 0 ? Math.round((completed.length / allBatches.length) * 100) : 0}%`}
                </p>
              </div>
              <div className='bg-orange-100 p-3 rounded-full'>
                <CheckCircle className='w-6 h-6 text-orange-600' />
              </div>
            </div>
          </div>

          {/* Pending Tests */}
          <div className='bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-500'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 font-medium'>Pending Tests</p>
                <p className='text-3xl font-bold text-gray-800 mt-1'>{loading ? '...' : pending.length}</p>
              </div>
              <div className='bg-teal-100 p-3 rounded-full'>
                <TestTube className='w-6 h-6 text-teal-600' />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Stats Cards - 4 column Grid */}
        <motion.div 
          variants={containerVariants}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
        >
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.label}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(tab.route)}
              className='group relative cursor-pointer'
            >
              <div className={`${tab.bgColor} rounded-2xl shadow-lg p-6 
                hover:shadow-2xl transition-all duration-300 border border-gray-100
                hover:border-gray-200`}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`${tab.color} mb-4 inline-block`}
                >
                  <tab.icon className='w-12 h-12' />
                </motion.div>

                {/* Title */}
                <h3 className='text-gray-600 text-sm font-medium mb-2'>
                  {tab.label}
                </h3>

                {/* Count */}
                <p className={`text-4xl font-bold bg-gradient-to-r ${tab.gradientFrom} ${tab.gradientTo} 
                  bg-clip-text text-transparent`}>
                  {tab.count}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
