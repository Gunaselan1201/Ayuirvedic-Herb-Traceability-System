import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Factory, 
  XCircle, 
  Calendar,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';

const FarmerDashboard = ({ farmerId, farmerName, currentLanguage }) => {
  const [dashboardData, setDashboardData] = useState({
    totalBatches: 0,
    batchesSentForTesting: 0,
    approvedByLab: 0,
    sentForManufacturing: 0,
    rejectedFailed: 0,
    lastEntryDate: null,
    recentLabUpdates: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Translation helper
  const t = (key) => {
    const translations = {
      en: {
        welcomeBack: 'Welcome Back',
        dashboardTitle: 'Dashboard Overview',
        totalBatches: 'Total Batches',
        batchesSent: 'Sent for Testing',
        approvedByLab: 'Approved by Lab',
        sentToManuf: 'Sent to Manufacturing',
        rejectedFailed: 'Rejected/Failed',
        lastEntry: 'Last Entry',
        recentActivity: 'Recent Lab Updates',
        viewDetails: 'Click to view details',
        tested: 'Tested',
        inTesting: 'In Testing',
        grade: 'Grade',
        noRecentActivity: 'No recent lab updates',
        batchId: 'Batch ID',
        product: 'Product',
        status: 'Status',
        date: 'Date',
        refreshing: 'Refreshing data...',
      },
      ta: {
        welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
        dashboardTitle: 'டாஷ்போர்டு கண்ணோட்டம்',
        totalBatches: 'மொத்த தொகுதிகள்',
        batchesSent: 'சோதனைக்கு அனுப்பப்பட்டது',
        approvedByLab: 'ஆய்வகத்தால் அங்கீகரிக்கப்பட்டது',
        sentToManuf: 'உற்பத்திக்கு அனுப்பப்பட்டது',
        rejectedFailed: 'நிராகரிக்கப்பட்டது/தோல்வி',
        lastEntry: 'கடைசி உள்ளீடு',
        recentActivity: 'சமீபத்திய ஆய்வக புதுப்பிப்புகள்',
        viewDetails: 'விவரங்களைக் காண கிளிக் செய்க',
        tested: 'சோதிக்கப்பட்டது',
        inTesting: 'சோதனையில்',
        grade: 'தரம்',
        noRecentActivity: 'சமீபத்திய ஆய்வக புதுப்பிப்புகள் இல்லை',
        batchId: 'தொகுதி ID',
        product: 'தயாரிப்பு',
        status: 'நிலை',
        date: 'தேதி',
        refreshing: 'தரவு புதுப்பிக்கப்படுகிறது...',
      },
      hi: {
        welcomeBack: 'वापस स्वागत है',
        dashboardTitle: 'डैशबोर्ड अवलोकन',
        totalBatches: 'कुल बैच',
        batchesSent: 'परीक्षण के लिए भेजा गया',
        approvedByLab: 'प्रयोगशाला द्वारा अनुमोदित',
        sentToManuf: 'विनिर्माण को भेजा गया',
        rejectedFailed: 'अस्वीकृत/विफल',
        lastEntry: 'अंतिम प्रविष्टि',
        recentActivity: 'हाल की प्रयोगशाला अपडेट',
        viewDetails: 'विवरण देखने के लिए क्लिक करें',
        tested: 'परीक्षण किया गया',
        inTesting: 'परीक्षण में',
        grade: 'ग्रेड',
        noRecentActivity: 'कोई हाल की प्रयोगशाला अपडेट नहीं',
        batchId: 'बैच ID',
        product: 'उत्पाद',
        status: 'स्थिति',
        date: 'तारीख',
        refreshing: 'डेटा रीफ्रेश हो रहा है...',
      }
    };

    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  // Fetch and process ledger data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch ledger/events from blockchain server
      const resp = await fetch('http://localhost:3001/events');
      if (!resp.ok) throw new Error(`Ledger fetch failed: ${resp.status}`);
      const ledgerData = await resp.json();

      // Determine farmer identifier to match entries. Ledger entries sometimes carry farmerId in data
      const fid = farmerId || 'F-00123';
      const farmerBatches = ledgerData.filter(entry => {
        if (!entry) return false;
        const addedByMatch = String(entry.addedBy || '').trim() === String(fid).trim();
        const dataFarmerMatch = entry.data && String(entry.data.farmerId || '').trim() === String(fid).trim();
        return addedByMatch || dataFarmerMatch;
      });

      // Calculate statistics
      const totalBatches = farmerBatches.length;
      const batchesSentForTesting = farmerBatches.filter(
        entry => entry.stage === "farmer"
      ).length;
      const approvedByLab = farmerBatches.filter(
        entry => entry.stage === "lab" && (entry.data.qualityGrade === "A" || entry.data.qualityGrade === "B")
      ).length;
      const sentForManufacturing = farmerBatches.filter(
        entry => entry.stage === "manufacturer"
      ).length;
      const rejectedFailed = farmerBatches.filter(
        entry => entry.stage === "lab" && (entry.data.qualityGrade === "F" || entry.data.qualityGrade === "Rejected")
      ).length;

      // Get last entry date
      const sortedBatches = [...farmerBatches].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const lastEntryDate = sortedBatches.length > 0 
        ? new Date(sortedBatches[0].timestamp).toLocaleDateString('en-GB')
        : null;

      // Get recent lab updates (last 2)
      const recentLabUpdates = sortedBatches
        .filter(entry => entry.stage === "lab")
        .slice(0, 2)
        .map(entry => ({
          batchId: entry.batchId,
          productName: entry.data.productName,
          grade: entry.data.qualityGrade,
          date: new Date(entry.timestamp).toLocaleDateString('en-GB'),
          status: entry.data.qualityGrade ? 'tested' : 'inTesting'
        }));

      setDashboardData({
        totalBatches,
        batchesSentForTesting,
        approvedByLab,
        sentForManufacturing,
        rejectedFailed,
        lastEntryDate,
        recentLabUpdates
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, [farmerId]);

  // Stats card configuration
  const statsCards = [
    {
      id: 1,
      title: t('batchesSent'),
      count: dashboardData.batchesSentForTesting,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      tooltip: t('viewDetails')
    },
    {
      id: 2,
      title: t('approvedByLab'),
      count: dashboardData.approvedByLab,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      tooltip: t('viewDetails')
    },
    {
      id: 3,
      title: t('sentToManuf'),
      count: dashboardData.sentForManufacturing,
      icon: Factory,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      tooltip: t('viewDetails')
    },
    {
      id: 4,
      title: t('rejectedFailed'),
      count: dashboardData.rejectedFailed,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      tooltip: t('viewDetails')
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
      {/* Header Section */}
      <motion.div 
        variants={cardVariants}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t('welcomeBack')}, {farmerName}
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {t('dashboardTitle')}
        </p>
        {/* Loading / Error status */}
        {loading && (
          <p className="text-sm text-gray-500 mt-2">{t('refreshing')}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-2">Error: {error}</p>
        )}
      </motion.div>

      {/* Summary Stats Row */}
      <motion.div 
        variants={cardVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Total Batches */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('totalBatches')}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{dashboardData.totalBatches}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Last Entry */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('lastEntry')}</p>
              <p className="text-xl font-bold text-gray-800 mt-1">
                {dashboardData.lastEntryDate || 'N/A'}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Recent Activity Count */}
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-teal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{t('recentActivity')}</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {dashboardData.recentLabUpdates.length}
              </p>
            </div>
            <div className="bg-teal-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Cards - 2x2 Grid */}
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

      {/* Recent Lab Updates Section */}
      <motion.div
        variants={cardVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          {t('recentActivity')}
        </h2>

        {dashboardData.recentLabUpdates.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentLabUpdates.map((update, index) => (
              <motion.div
                key={update.batchId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r 
                  from-blue-50 to-purple-50 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${update.grade === 'A' ? 'bg-green-100' : 
                      update.grade === 'B' ? 'bg-blue-100' : 
                      update.grade === 'F' ? 'bg-red-100' : 'bg-gray-100'}`}>
                    {update.grade === 'A' || update.grade === 'B' ? (
                      <CheckCircle className={`w-6 h-6 ${
                        update.grade === 'A' ? 'text-green-600' : 'text-blue-600'
                      }`} />
                    ) : update.grade === 'F' ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-800">
                      {update.productName} {t('product')} ({update.batchId})
                    </p>
                    <p className="text-sm text-gray-600">
                      {update.status === 'tested' 
                        ? `${t('tested')} on ${update.date}` 
                        : t('inTesting')}
                    </p>
                  </div>
                </div>

                {update.grade && (
                  <div className={`px-4 py-2 rounded-full font-bold text-sm
                    ${update.grade === 'A' ? 'bg-green-200 text-green-800' : 
                      update.grade === 'B' ? 'bg-blue-200 text-blue-800' : 
                      'bg-red-200 text-red-800'}`}>
                    {t('grade')}: {update.grade}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t('noRecentActivity')}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FarmerDashboard;
