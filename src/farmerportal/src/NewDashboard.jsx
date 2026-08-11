import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, CheckCircle, Factory, XCircle, TrendingUp, Clock, Package } from 'lucide-react';
import { getFarmerStats } from '../../services/blockchainService';

const NewDashboard = ({ farmerName, onNavigate, t, farmerId }) => {
  const [stats, setStats] = useState({
    sentForTesting: 0,
    approvedByLab: 0,
    sentToManufacturing: 0,
    rejectedFailed: 0,
    totalBatches: 0,
    successRate: 0,
    pendingTests: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const farmStats = await getFarmerStats(farmerId || 'F-00123');
        setStats(farmStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          sentForTesting: 0,
          approvedByLab: 0,
          sentToManufacturing: 0,
          rejectedFailed: 0,
          totalBatches: 0,
          successRate: 0,
          pendingTests: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [farmerId]);

  // Stats card configuration - matches FarmerDashboard style
  const statsCards = [
    {
      id: 'sentForTesting',
      title: t ? t('sentForTesting') : 'Sent for Testing',
      count: stats.sentForTesting,
      icon: FlaskConical,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      tooltip: t ? t('viewDetails') : 'View Details'
    },
    {
      id: 'approvedByLab',
      title: t ? t('approvedByLab') : 'Approved by Lab',
      count: stats.approvedByLab,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      tooltip: t ? t('viewDetails') : 'View Details'
    },
    {
      id: 'sentToManufacturing',
      title: t ? t('sentToManufacturing') : 'Sent to Manufacturing',
      count: stats.sentToManufacturing,
      icon: Factory,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      tooltip: t ? t('viewDetails') : 'View Details'
    },
    {
      id: 'rejectedFailed',
      title: t ? t('rejectedFailed') : 'Rejected / Failed',
      count: stats.rejectedFailed,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      tooltip: t ? t('viewDetails') : 'View Details'
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
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white p-6"
    >
      <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        variants={cardVariants}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t ? t('welcomeBack') : 'Welcome back'}, {farmerName}
        </h1>
        <p className="text-gray-600">
          {t ? t('monitorBatches') : 'Monitor and manage your herb batches throughout the supply chain'}
        </p>
      </motion.div>      {/* Summary Stats Row */}
      <motion.div 
        variants={cardVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Total Batches */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t ? t('totalBatches') : 'Total Batches'}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '...' : stats.totalBatches}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t ? t('successRate') : 'Success Rate'}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '...' : `${stats.successRate}%`}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Pending Tests */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t ? t('pendingTests') : 'Pending Tests'}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{loading ? '...' : stats.pendingTests}</p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Cards - 4 column Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(card.id)}
            className="group relative"
          >
            <div className={`${card.bgColor} rounded-2xl shadow-lg p-6 cursor-pointer 
              hover:shadow-2xl transition-all duration-300 border border-gray-100
              hover:border-gray-200`}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 
                group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                {card.tooltip}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className={`${card.iconColor} mb-4 inline-block`}
              >
                <card.icon className="w-12 h-12" />
              </motion.div>

              {/* Title */}
              <h3 className="text-gray-600 text-sm font-medium mb-2">
                {card.title}
              </h3>

              {/* Count */}
              <p className={`text-4xl font-bold bg-gradient-to-r ${card.color} 
                bg-clip-text text-transparent`}>
                {card.count}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </motion.div>
  );
};

export default NewDashboard;
