
import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, Upload, X, CheckCircle2, Home, PlusSquare, ShoppingCart, Bell, Settings, HelpCircle, User, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './Login.jsx';
import LanguageSelector from './LanguageSelector.jsx';
import NewDashboard from './NewDashboard.jsx';
import FarmerDashboard from './FarmerDashboard.jsx';
import ActiveOrders from './orders/ActiveOrders.jsx';
import LastOrders from './orders/LastOrders.jsx';
import RejectedOrders from './orders/RejectedOrders.jsx';
import HelpSupport from './components/HelpSupport.jsx';
// New Dashboard Pages
import SentForTestingList from './testing/SentForTestingList.jsx';
import SentForTestingDetail from './testing/SentForTestingDetail.jsx';
import ApprovedByLabList from './approved/ApprovedByLabList.jsx';
import ApprovedByLabDetail from './approved/ApprovedByLabDetail.jsx';
import SentToManufacturingList from './manufacturing/SentToManufacturingList.jsx';
import SentToManufacturingDetail from './manufacturing/SentToManufacturingDetail.jsx';
import RejectedFailedList from './rejected/RejectedFailedList.jsx';
import RejectedFailedDetail from './rejected/RejectedFailedDetail.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import NotificationModal from './components/NotificationModal.jsx';
import NotificationSidebar from './components/NotificationSidebar.jsx';
import { getTranslation } from './translations.js';
import { getEvents } from './lib/blockchainService';

const App = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [farmerData, setFarmerData] = useState({
    farmerName: props.farmerName || 'farmer_name',
    farmerId: props.farmerId || 'farmer_id'
  });
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
  
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [uploadStatuses, setUploadStatuses] = useState(['idle', 'idle', 'idle']); // idle, uploading, success, error
  const [generatedBatchId, setGeneratedBatchId] = useState(null);
  const [showBatchIdBadge, setShowBatchIdBadge] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState('menu'); // 'menu', 'settings', 'orders', 'notifications'
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('farmerPortalLanguage') || 'en';
  });
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [currentView, setCurrentView] = useState('newDashboard'); // Main view state
  const [selectedBatchId, setSelectedBatchId] = useState(null); // For detail pages
  const [totalBatches, setTotalBatches] = useState(0); // Total batches from blockchain

  const t = (key) => getTranslation(currentLanguage, key);

  // Fetch total batches from blockchain
  useEffect(() => {
    const fetchTotalBatches = async () => {
      try {
        const ledgerData = await getEvents();
        
        // Filter batches for this farmer
        const fid = farmerData.farmerId || 'F-00123';
        const farmerBatches = ledgerData.filter(entry => {
          if (!entry) return false;
          const addedByMatch = String(entry.addedBy || '').trim() === String(fid).trim();
          const dataFarmerMatch = entry.data && String(entry.data.farmerId || '').trim() === String(fid).trim();
          return addedByMatch || dataFarmerMatch;
        });
        
        // Count unique batches (filter by stage="farmer")
        const farmerStageBatches = farmerBatches.filter(entry => entry.stage === "farmer");
        setTotalBatches(farmerStageBatches.length);
      } catch (error) {
        console.error('Error fetching total batches:', error);
      }
    };

    if (isAuthenticated) {
      fetchTotalBatches();
      // Refresh every 30 seconds
      const interval = setInterval(fetchTotalBatches, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, farmerData.farmerId]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/notifications/farmer');
        const data = await response.json();
        
        // Sort by timestamp (newest first)
        const sorted = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setNotifications(sorted);
        
        // Count unread
        const unread = sorted.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // DO NOT show login popup - users will see unread count on notification icon
  // Login notification popup removed as per requirement

  // Navigation handlers for new dashboard
  const handleDashboardNavigate = (section) => {
    setCurrentView(section);
    setSidebarOpen(false);
  };

  const handleViewBatchDetail = (batchId) => {
    setSelectedBatchId(batchId);
    // Determine which detail page to show based on current view
    if (currentView === 'sentForTesting') setCurrentView('sentForTestingDetail');
    else if (currentView === 'approvedByLab') setCurrentView('approvedByLabDetail');
    else if (currentView === 'sentToManufacturing') setCurrentView('sentToManufacturingDetail');
    else if (currentView === 'rejectedFailed') setCurrentView('rejectedFailedDetail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('newDashboard');
    setSelectedBatchId(null);
  };

  const handleBackToList = () => {
    // Go back from detail to list view
    if (currentView === 'sentForTestingDetail') setCurrentView('sentForTesting');
    else if (currentView === 'approvedByLabDetail') setCurrentView('approvedByLab');
    else if (currentView === 'sentToManufacturingDetail') setCurrentView('sentToManufacturing');
    else if (currentView === 'rejectedFailedDetail') setCurrentView('rejectedFailed');
    setSelectedBatchId(null);
  };

  // Generate Batch ID
  const generateBatchId = async (farmerId, state, productName) => {
    try {
      // Get current date in DDMM format
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const datePart = `${day}${month}`;
      
      // Extract parts: First3(FarmerID), State2, DateDDMM, First2(Product)
      const farmerPart = farmerId.substring(0, 3).toUpperCase();
      const statePart = state.match(/\(([^)]+)\)/)?.[1] || state.substring(0, 2).toUpperCase(); // Extract code from "Tamil Nadu (TN)"
      const productPart = productName.substring(0, 2).toUpperCase();
      
      // Generate base Batch ID
      let batchId = `${farmerPart}${statePart}${datePart}${productPart}`;
      
      // Check for duplicates in blockchain
      const ledgerData = await getEvents();
      if (ledgerData.length > 0) {
        const existingIds = ledgerData.map(entry => entry.batchId);
        
        // If duplicate exists, append a counter
        let counter = 1;
        let uniqueBatchId = batchId;
        while (existingIds.includes(uniqueBatchId)) {
          uniqueBatchId = `${batchId}${counter}`;
          counter++;
        }
        batchId = uniqueBatchId;
      }
      
      return batchId;
    } catch (error) {
      console.error('Error generating Batch ID:', error);
      // Fallback to simple generation if API fails
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const farmerPart = farmerId.substring(0, 3).toUpperCase();
      const statePart = state.match(/\(([^)]+)\)/)?.[1] || state.substring(0, 2).toUpperCase();
      const productPart = productName.substring(0, 2).toUpperCase();
      return `${farmerPart}${statePart}${day}${month}${productPart}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Generate Batch ID
    const batchId = await generateBatchId(
      farmerData.farmerId || 'F-00123',
      data.state,
      data.productName
    );
    
    setGeneratedBatchId(batchId);
    setShowBatchIdBadge(true);
    
    // Add batch ID and images to data
    data.batchId = batchId;
    data.farmerId = farmerData.farmerId;
    data.stage = 'farmer';
    data.timestamp = new Date().toISOString();
    
    // Add images if uploaded
    const uploadedImages = selectedImages.filter(img => img !== null);
    if (uploadedImages.length > 0) {
      data.photos = uploadedImages;
    }
    
    try {
      // Send to backend using blockchain service
      const { postBatch } = await import('./lib/blockchainService');
      await postBatch(data);
      
      // DO NOT send notification to Lab Portal upon product creation
      // Lab will see new batches in their dashboard without notification
      
      // Show success toast
      setToastMessage(`✅ Batch ID ${batchId} created and stored successfully.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
        
      // Reset form after 2 seconds
      setTimeout(() => {
        e.target.reset();
        removeAllImages();
        setShowBatchIdBadge(false);
        setGeneratedBatchId(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setToastMessage('❌ Error: Failed to save batch data.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleLoginSuccess = (userData) => {
    setFarmerData(userData);
    setIsAuthenticated(true);
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('farmerPortalLanguage', langCode);
    setShowLanguageSelector(false);
    setSidebarView('menu');
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        const newStatuses = [...uploadStatuses];
        newStatuses[index] = 'error';
        setUploadStatuses(newStatuses);
        setTimeout(() => {
          const resetStatuses = [...uploadStatuses];
          resetStatuses[index] = 'idle';
          setUploadStatuses(resetStatuses);
        }, 3000);
        return;
      }
      
      const newImages = [...selectedImages];
      newImages[index] = file;
      setSelectedImages(newImages);
      
      const newStatuses = [...uploadStatuses];
      newStatuses[index] = 'success';
      setUploadStatuses(newStatuses);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...imagePreviews];
        newPreviews[index] = reader.result;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages[index] = null;
    setSelectedImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
    
    const newStatuses = [...uploadStatuses];
    newStatuses[index] = 'idle';
    setUploadStatuses(newStatuses);
  };

  const removeAllImages = () => {
    setSelectedImages([null, null, null]);
    setImagePreviews([null, null, null]);
    setUploadStatuses(['idle', 'idle', 'idle']);
  };

  const handleLogout = () => {
    // Clear any stored data
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setSidebarOpen(false);
  };

  // Notification handlers
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    setSidebarOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:3001/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      if (unreadIds.length === 0) return;

      await fetch('http://localhost:3001/notifications/read-multiple', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: unreadIds }),
      });

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: t('dashboard'), href: '#', onClick: () => { setCurrentView('newDashboard'); setSidebarOpen(false); }, view: 'newDashboard' },
    { icon: PlusSquare, label: t('addProduct'), href: '#', onClick: () => { setCurrentView('form'); setSidebarOpen(false); }, view: 'form' },
    { icon: ShoppingCart, label: t('orders'), href: '#', onClick: () => setSidebarView('orders'), view: null },
  ];

  const settingsItems = [
    { icon: Settings, label: t('settings'), href: '#', onClick: () => setSidebarView('settings'), view: null },
    { icon: HelpCircle, label: t('helpSupport'), href: '#', onClick: () => { setCurrentView('helpSupport'); setSidebarOpen(false); }, view: 'helpSupport' },
    { icon: LogOut, label: t('logout'), href: '#', onClick: handleLogout, view: null, isLogout: true },
  ];

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show language selector
  if (showLanguageSelector) {
    return (
      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onBack={() => setShowLanguageSelector(false)}
      />
    );
  }

  const { farmerName, farmerId } = farmerData;

  return (
    <div className="min-h-screen bg-white">
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 right-6 bg-white border-l-4 border-green-500 shadow-2xl rounded-lg p-4 z-50 max-w-md"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <p className="text-gray-800 font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bg-black bg-opacity-30 z-40"
            onClick={() => setSidebarOpen(false)}
            style={{ 
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              height: 'calc(100vh - 72px)',
              width: '100vw'
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-6 top-24 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{ height: '525px' }}
          >
            {/* Conditional Content - Menu, Settings, Orders, Notifications */}
            {sidebarView === 'menu' ? (
              <>
                {/* Sidebar Header */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">☰</div>
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">{t('options')}</h2>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3 overflow-y-auto custom-scrollbar" style={{ height: '440px' }}>
                  <div className="mb-2">
                    {menuItems.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.href}
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                          }
                        }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 mb-1 ${
                          item.view && currentView === item.view
                            ? 'bg-gray-200 text-gray-900 font-semibold'
                            : 'hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </motion.a>
                    ))}
                  </div>

                  <div className="my-2">
                    {settingsItems.map((item, index) => (
                      <motion.a
                        key={index}
                        href={item.href}
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                          }
                        }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 mb-1 ${
                          item.isLogout
                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-medium'
                            : item.view && currentView === item.view
                            ? 'bg-gray-200 text-gray-900 font-semibold'
                            : 'hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </motion.a>
                    ))}
                  </div>

                  {/* Account Info */}
                  <div className="mt-4 pt-3 border-t border-gray-300">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{t('accountInfo')}</h3>
                    <div className="space-y-1 text-sm text-gray-800">
                      <div className="flex items-start">
                        <span className="text-gray-600">{t('farmerId')}: {farmerData.farmerId}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-600">{t('name')}: {farmerData.farmerName}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-600">{t('mobileNo')}: +91 98765 43210</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-gray-600">{t('address')}: Mohanur, Namakkal</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer - Last Login Time */}
                <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 text-right">
                  <p className="text-xs text-gray-600">{t('lastLogin')}: 02-11-2025 09:15 AM</p>
                </div>
              </>
            ) : sidebarView === 'settings' ? (
              <>
                {/* Settings View */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setSidebarView('menu')}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      {t('settings').toUpperCase()}
                    </h2>
                    <div className="w-6"></div>
                  </div>
                </div>
                <div className="p-3 overflow-y-auto custom-scrollbar" style={{ height: '440px' }}>
                  <div className="space-y-2">
                    <motion.div 
                      whileHover={{ x: 4 }}
                      onClick={() => setShowLanguageSelector(true)}
                      className="px-3 py-2 text-base text-gray-700 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      {t('language')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('reportIssue'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'reportIssue' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('reportIssue')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('helpSupport'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'helpSupport' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('helpSupport')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={handleLogout}
                      className="px-3 py-2 text-base text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium"
                    >
                      {t('logout')}
                    </motion.div>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 text-right">
                  <p className="text-xs text-gray-600">Last login: 02-11-2025 09:15 AM</p>
                </div>
              </>
            ) : sidebarView === 'orders' ? (
              <>
                {/* Orders View */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setSidebarView('menu')}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      {t('orders').toUpperCase()}
                    </h2>
                    <div className="w-6"></div>
                  </div>
                </div>
                <div className="p-3 overflow-y-auto custom-scrollbar" style={{ height: '440px' }}>
                  <div className="space-y-2">
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('activeOrders'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'activeOrders' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('activeOrders')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('lastOrders'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'lastOrders' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('lastOrder')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('sentToManufacturing'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'sentToManufacturing' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('sentToManufacturing')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('rejectedOrders'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'rejectedOrders' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('rejectedOrders')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      onClick={() => { setCurrentView('helpSupport'); setSidebarOpen(false); }}
                      className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                        currentView === 'helpSupport' 
                          ? 'bg-gray-200 text-gray-900 font-semibold' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {t('helpSupport')}
                    </motion.div>
                    <motion.div 
                      whileHover={{ x: 4 }} 
                      className="px-3 py-2 text-base font-medium text-gray-900 bg-green-50 border-l-4 border-green-600 rounded-lg flex items-center justify-between"
                    >
                      <span>{t('ordersSent')}</span>
                      <span className="text-2xl font-bold text-green-700">{totalBatches}</span>
                    </motion.div>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 text-right">
                  <p className="text-xs text-gray-600">Last login: 02-11-2025 09:15 AM</p>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 relative z-50 shadow-lg sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[65px] py-2">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu Icon */}
              <motion.button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <motion.div
                  animate={sidebarOpen ? "open" : "closed"}
                  className="w-6 h-6 flex flex-col justify-center items-center gap-1.5"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 8 }
                    }}
                    className="w-6 h-0.5 bg-white rounded-full block"
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    className="w-6 h-0.5 bg-white rounded-full block"
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -8 }
                    }}
                    className="w-6 h-0.5 bg-white rounded-full block"
                  />
                </motion.div>
              </motion.button>

              {/* Profile Section - No Click Handler */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-white/40 mt-2"></div>
                    <div className="w-10 h-6 bg-white/60 rounded-t-full mt-1"></div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-white">{farmerName}</div>
                  <div className="text-xs text-green-100">{farmerId}</div>
                </div>
              </div>
            </div>
        <h1 
          onClick={() => setCurrentView('newDashboard')}
          className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white tracking-tight cursor-pointer"
        >
          {t('farmerPortal')}
        </h1>
        
        {/* Notification Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setNotificationSidebarOpen(true)}
          className="relative p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
        >
          <Bell className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'newDashboard' ? (
          <motion.div
            key="newDashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <NewDashboard 
              farmerName={farmerData.farmerName}
              farmerId={farmerData.farmerId}
              onNavigate={handleDashboardNavigate}
              t={t}
            />
          </motion.div>
        ) : currentView === 'sentForTesting' ? (
          <motion.div
            key="sentForTesting"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SentForTestingList 
              onBack={handleBackToDashboard}
              onViewDetails={handleViewBatchDetail}
              farmerId={farmerData.farmerId}
              t={t}
            />
          </motion.div>
        ) : currentView === 'sentForTestingDetail' ? (
          <motion.div
            key="sentForTestingDetail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SentForTestingDetail 
              batchId={selectedBatchId}
              onBack={handleBackToList}
            />
          </motion.div>
        ) : currentView === 'approvedByLab' ? (
          <motion.div
            key="approvedByLab"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ApprovedByLabList 
              onBack={handleBackToDashboard}
              onViewDetails={handleViewBatchDetail}
              farmerId={farmerData.farmerId}
              t={t}
            />
          </motion.div>
        ) : currentView === 'approvedByLabDetail' ? (
          <motion.div
            key="approvedByLabDetail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ApprovedByLabDetail 
              batchId={selectedBatchId}
              onBack={handleBackToList}
            />
          </motion.div>
        ) : currentView === 'sentToManufacturing' ? (
          <motion.div
            key="sentToManufacturing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SentToManufacturingList 
              onBack={handleBackToDashboard}
              onViewDetails={handleViewBatchDetail}
              farmerId={farmerData.farmerId}
              t={t}
            />
          </motion.div>
        ) : currentView === 'sentToManufacturingDetail' ? (
          <motion.div
            key="sentToManufacturingDetail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SentToManufacturingDetail 
              batchId={selectedBatchId}
              onBack={handleBackToList}
            />
          </motion.div>
        ) : currentView === 'rejectedFailed' ? (
          <motion.div
            key="rejectedFailed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RejectedFailedList 
              onBack={handleBackToDashboard}
              onViewDetails={handleViewBatchDetail}
              farmerId={farmerData.farmerId}
              t={t}
            />
          </motion.div>
        ) : currentView === 'rejectedFailedDetail' ? (
          <motion.div
            key="rejectedFailedDetail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RejectedFailedDetail 
              batchId={selectedBatchId}
              onBack={handleBackToList}
            />
          </motion.div>
        ) : currentView === 'activeOrders' ? (
          <motion.div
            key="activeOrders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ActiveOrders 
              currentLanguage={currentLanguage}
              onBack={() => setCurrentView('newDashboard')}
            />
          </motion.div>
        ) : currentView === 'sentToManufacturing' ? (
          <motion.div
            key="sentToManufacturing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <SentToManufacturingList 
              onBack={() => setCurrentView('newDashboard')}
              onViewDetails={(batchId) => {
                setSelectedBatchId(batchId);
                setCurrentView('sentToManufacturingDetail');
              }}
              t={t}
              farmerId={farmerData.farmerId}
            />
          </motion.div>
        ) : currentView === 'lastOrders' ? (
          <motion.div
            key="lastOrders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LastOrders 
              currentLanguage={currentLanguage}
              onBack={() => setCurrentView('newDashboard')}
            />
          </motion.div>
        ) : currentView === 'rejectedOrders' ? (
          <motion.div
            key="rejectedOrders"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <RejectedOrders 
              currentLanguage={currentLanguage}
              onBack={() => setCurrentView('newDashboard')}
            />
          </motion.div>
        ) : currentView === 'helpSupport' ? (
          <motion.div
            key="helpSupport"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <HelpSupport 
              onBack={() => setCurrentView('newDashboard')}
              t={t}
            />
          </motion.div>
        ) : currentView === 'reportIssue' ? (
          <motion.div
            key="reportIssue"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ReportIssue 
              onBack={() => setCurrentView('newDashboard')}
              farmerData={farmerData}
              t={t}
            />
          </motion.div>
        ) : (
          <motion.main
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
            <button
              onClick={() => setCurrentView('newDashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('productName')}</label>
              <select name="productName" required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none">
                <option>{t('tulsi')}</option>
                <option>{t('wheat')}</option>
                <option>{t('rice')}</option>
                <option>{t('cotton')}</option>
              </select>
            </div>
            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('quantity')}</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  defaultValue="05"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('unit')}</label>
                <select name="unit" required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none">
                  <option>{t('ton')}</option>
                  <option>{t('kg')}</option>
                  <option>{t('quintal')}</option>
                </select>
              </div>
            </div>
            {/* Harvested Date */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('harvestedDate')}</label>
              <input
                type="date"
                name="harvestedDate"
                required
                defaultValue="2025-09-26"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              />
            </div>
            {/* Longitude and Latitude */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('longitude')}</label>
                <input
                  type="text"
                  name="longitude"
                  required
                  defaultValue="11.0150"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('latitude')}</label>
                <input
                  type="text"
                  name="latitude"
                  required
                  defaultValue="78.2980"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                />
              </div>
            </div>
            {/* Village/Town */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('villageTown')}</label>
              <input
                type="text"
                name="villageTown"
                required
                defaultValue="Mohanur"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              />
            </div>
            {/* District */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('district')}</label>
              <input
                type="text"
                name="district"
                required
                defaultValue="Namakkal"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              />
            </div>
          </div>
          {/* Right Column - Photo Upload and Additional Fields */}
          <div className="space-y-6">
            {/* Generated Batch ID Badge */}
            <AnimatePresence>
              {showBatchIdBadge && generatedBatchId && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6" />
                    <div>
                      <p className="text-sm font-medium opacity-90">Generated Batch ID:</p>
                      <p className="text-2xl font-bold tracking-wide">{generatedBatchId}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Geo tag photos - 3 uploads */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-3 text-lg">{t('geoTagPhoto')} (3 Photos)</h3>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-56 flex flex-col items-center justify-center overflow-hidden hover:border-green-400 transition-colors duration-300">
                    <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Photo {index + 1}
                    </div>
                    <AnimatePresence mode="wait">
                      {!imagePreviews[index] ? (
                        <motion.label
                          key={`upload-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, index)}
                            className="hidden"
                          />
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center mb-3"
                          >
                            <Upload className="w-6 h-6 text-green-600" />
                          </motion.div>
                          <span className="text-gray-700 font-semibold text-sm mb-1">{t('uploadPhoto')}</span>
                          <span className="text-gray-500 text-xs">{t('clickToBrowse')}</span>
                          {uploadStatuses[index] === 'error' && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-red-500 text-xs mt-2"
                            >
                              {t('fileTooLarge')}
                            </motion.span>
                          )}
                        </motion.label>
                      ) : (
                        <motion.div
                          key={`preview-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative w-full h-full"
                        >
                          <img
                            src={imagePreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover animate-fadeIn"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeImage(index)}
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                          {uploadStatuses[index] === 'success' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span className="text-xs font-medium">{t('uploaded')}</span>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            {/* State */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('state')}</label>
              <select name="state" required className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none">
                <option>Tamil Nadu (TN)</option>
                <option>Karnataka (KA)</option>
                <option>Kerala (KL)</option>
              </select>
            </div>
            {/* Added By */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('addedBy')}</label>
              <input
                type="text"
                name="addedBy"
                required
                defaultValue="Gunaselan"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              />
            </div>
            {/* Date & Time */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">{t('dateTime')}</label>
              <input
                type="text"
                name="dateTime"
                required
                defaultValue="28/09/2025, 04:31 pm"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
              />
            </div>
            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('submit')}
            </motion.button>
          </div>
        </form>
      </motion.main>
        )}
      </AnimatePresence>

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotificationModal && selectedNotification && (
          <NotificationModal
            notification={selectedNotification}
            onClose={() => {
              setShowNotificationModal(false);
              setSelectedNotification(null);
            }}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </AnimatePresence>

      {/* Notification Sidebar - No login popup, users see unread badge */}
      <NotificationSidebar
        isOpen={notificationSidebarOpen}
        onClose={() => setNotificationSidebarOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
};

export default App;
