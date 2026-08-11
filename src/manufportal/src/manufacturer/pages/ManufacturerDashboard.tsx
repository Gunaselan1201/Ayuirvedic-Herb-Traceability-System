import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, TrendingUp, Factory, Award, Beaker } from 'lucide-react';

interface ManufacturerDashboardProps {
  manufacturerId: string;
}

interface DashboardStats {
  approvedByLab: number;
  activeBatches: number;
  manufactured: number;
  dispatched: number;
}

export function ManufacturerDashboard({ manufacturerId }: ManufacturerDashboardProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    approvedByLab: 0,
    activeBatches: 0,
    manufactured: 0,
    dispatched: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
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

        let approvedByLab = 0;
        let activeBatches = 0;
        let manufactured = 0;
        let dispatched = 0;

        for (const [batchId, stages] of batchMap.entries()) {
          const { lab, manufacturer } = stages;
          
          // Approved by lab (has lab approval, no manufacturer stage yet)
          if (lab && lab.data?.qualityGrade && ['A', 'B', 'C'].includes(lab.data.qualityGrade) && !manufacturer) {
            approvedByLab++;
          }
          
          // Manufacturer stage exists
          if (manufacturer) {
            const manufData = manufacturer.data || {};
            const status = manufData.status || manufData.productionStatus || '';
            
            if (status === 'In Production' || status === 'Processing') {
              activeBatches++;
            } else if (status === 'Manufactured' || status === 'Completed' || status === 'Ready') {
              manufactured++;
            } else if (status === 'Dispatched' || status === 'Shipped') {
              dispatched++;
            } else {
              // Default: if manufacturer stage exists but no status, count as manufactured
              manufactured++;
            }
          }
        }

        setStats({
          approvedByLab,
          activeBatches,
          manufactured,
          dispatched,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [manufacturerId]);

  // Tab configuration matching Lab Portal style
  const tabs = [
    {
      label: 'Approved by Lab',
      count: stats.approvedByLab,
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-600',
      borderColor: 'border-blue-500',
      hoverBg: 'hover:bg-blue-50',
  route: '/approved-by-lab'
    },
    {
      label: 'Active Batches',
      count: stats.activeBatches,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-orange-600',
      borderColor: 'border-amber-500',
      hoverBg: 'hover:bg-amber-50',
  route: '/active-batches'
    },
    {
      label: 'Products Manufactured',
      count: stats.manufactured,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-emerald-600',
      borderColor: 'border-green-500',
      hoverBg: 'hover:bg-green-50',
  route: '/manufactured'
    },
    {
      label: 'Dispatched Orders',
      count: stats.dispatched,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-indigo-600',
      borderColor: 'border-purple-500',
      hoverBg: 'hover:bg-purple-50',
  route: '/dispatched'
    }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='mb-6'
      >
        <div className='flex items-center gap-3 mb-2'>
          <Factory className='w-8 h-8 text-amber-600' />
          <h1 className='text-3xl font-bold text-gray-800'>
            Manufacturer Dashboard
          </h1>
        </div>
        <p className='text-gray-600'>
          ID: <span className='font-semibold'>{manufacturerId}</span> • {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </motion.div>

      {/* Statistics Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {tabs.map((tab, index) => {
          const IconComponent = tab.icon;
          return (
            <motion.div
              key={tab.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => navigate(tab.route)}
              className={`${tab.bgColor} rounded-2xl p-6 shadow-lg border-l-4 ${tab.borderColor} cursor-pointer transition-all hover:shadow-xl`}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 bg-gradient-to-r ${tab.gradientFrom} ${tab.gradientTo} rounded-xl`}>
                  <IconComponent className='w-6 h-6 text-white' />
                </div>
                {loading ? (
                  <div className='animate-pulse bg-gray-300 h-8 w-12 rounded'></div>
                ) : (
                  <span className={`text-3xl font-bold ${tab.color}`}>
                    {tab.count}
                  </span>
                )}
              </div>
              <h3 className='text-gray-700 font-semibold text-sm mb-1'>{tab.label}</h3>
              <p className='text-gray-500 text-xs'>Click to view details →</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs Section - Matching Lab/Farmer Portal Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className='bg-white rounded-2xl shadow-xl p-6 border border-gray-200'
      >
        <h2 className='text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
          <Package className='w-6 h-6 text-amber-600' />
          Production Overview
        </h2>

        {/* Tab Buttons */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <motion.button
                key={tab.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(tab.route)}
                className={`${tab.hoverBg} rounded-xl p-5 border-2 ${tab.borderColor} transition-all hover:shadow-lg group`}
              >
                <div className='flex items-center gap-3 mb-3'>
                  <div className={`p-2 ${tab.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-5 h-5 ${tab.color}`} />
                  </div>
                  <span className={`text-2xl font-bold ${tab.color}`}>
                    {tab.count}
                  </span>
                </div>
                <h3 className='text-gray-800 font-semibold text-sm text-left'>
                  {tab.label}
                </h3>
                <p className='text-gray-500 text-xs text-left mt-1'>
                  View all →
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Stats Summary */}
        <div className='mt-8 pt-6 border-t border-gray-200'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
            <div>
              <p className='text-gray-500 text-sm mb-1'>Total Pipeline</p>
              <p className='text-2xl font-bold text-gray-800'>
                {stats.approvedByLab + stats.activeBatches + stats.manufactured + stats.dispatched}
              </p>
            </div>
            <div>
              <p className='text-gray-500 text-sm mb-1'>In Progress</p>
              <p className='text-2xl font-bold text-amber-600'>
                {stats.activeBatches}
              </p>
            </div>
            <div>
              <p className='text-gray-500 text-sm mb-1'>Ready to Ship</p>
              <p className='text-2xl font-bold text-green-600'>
                {stats.manufactured}
              </p>
            </div>
            <div>
              <p className='text-gray-500 text-sm mb-1'>Completion Rate</p>
              <p className='text-2xl font-bold text-purple-600'>
                {stats.approvedByLab + stats.activeBatches + stats.manufactured + stats.dispatched > 0
                  ? Math.round((stats.dispatched / (stats.approvedByLab + stats.activeBatches + stats.manufactured + stats.dispatched)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
