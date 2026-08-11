import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Settings, HelpCircle, ChevronLeft, Bell, User, Globe,
  FlaskConical, Clock, Package, XCircle, PieChart, AlertCircle, LogOut, Menu
} from 'lucide-react';
import { LabNavbar } from './components/LabNavbar';
import { LanguageSelector } from './components/LanguageSelector';
import { LabLogin } from './pages/LabLogin';
import { LabDashboard } from './pages/LabDashboard';
import { LabForm } from './pages/LabForm';
import { BatchTestingForm } from './pages/BatchTestingForm';
import { TestNewBatch } from './pages/TestNewBatch';
import { AllBatches } from './pages/AllBatches';
import { RejectedBatches } from './pages/RejectedBatches';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { TestedBatches } from './pages/TestedBatches';
import { ApprovedTests } from './pages/ApprovedTests';
import { SentToManufacturer } from './pages/SentToManufacturer';
import { LastTested } from './pages/LastTested';
import { LabSentToManufacturing } from './pages/LabSentToManufacturing';
import { LabNotificationModal } from './components/LabNotificationModal';
import LabNotificationSidebar from './components/LabNotificationSidebar';
import { HelpSupport } from './pages/HelpSupport';
import { ReportIssue } from './pages/Support/ReportIssue';
import { ViewTickets } from './pages/Support/ViewTickets';
import { getTranslation } from './translations';
import type { LabBatch, LedgerEvent } from '../../../types';

interface Notification {
  id: string;
  type: string;
  portalType: string;
  title: string;
  message: string;
  batchId: string;
  productName: string;
  timestamp: string;
  isRead: boolean;
  farmerName?: string;
  farmerId?: string;
  manufacturerName?: string;
  qualityGrade?: string;
  quantity?: number;
  unit?: string;
  status?: string;
  reason?: string;
}

export function LabApp() {
  const [labSession, setLabSession] = useState<{ labId: string } | null>(() => {
    const savedSession = localStorage.getItem('labSession');
    // Show login page if no session exists
    if (!savedSession) {
      return null;
    }
    return JSON.parse(savedSession);
  });
  const [batches, setBatches] = useState<LabBatch[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState('menu');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const t = (key: string) => getTranslation(currentLanguage, key);

  useEffect(() => {
    async function loadFromLedger() {
      try {
        const res = await fetch('http://localhost:3001/events');
        const allEvents: LedgerEvent[] = await res.json();
        const map = new Map<string, { farmer?: LedgerEvent; lab?: LedgerEvent }>();
        for (const ev of allEvents) {
          const e = map.get(ev.batchId) || {} as any;
          if (ev.stage === 'farmer') e.farmer = e.farmer ?? ev;
          if (ev.stage === 'lab') e.lab = e.lab ?? ev;
          map.set(ev.batchId, e);
        }
        const next: LabBatch[] = [];
        for (const [id, info] of map.entries()) {
          if (!info.farmer) continue;
          const f = info.farmer;
          const data: any = f.data || {};
          
          // Determine status based on quality grade and approval status
          let status = 'PENDING';
          if (info.lab) {
            const labData = info.lab.data || {};
            // Check approvalStatus field first (new system)
            if (labData.approvalStatus === 'rejected') {
              status = 'REJECTED';
            } else if (labData.qualityGrade === 'F' || labData.qualityGrade === 'Rejected') {
              // Fallback for old data
              status = 'REJECTED';
            } else {
              status = 'TESTED';
            }
          }
          
          next.push({
            id,
            productName: data.productName ?? '-',
            farmerName: data.farmerId ?? f.addedBy ?? '-',
            collectionDate: data.harvestedDate ?? f.timestamp ?? '',
            status,
            addedBy: info.lab?.addedBy ?? f.addedBy,
          } as LabBatch);
        }
        setBatches(next);
      } catch {
        setBatches([]);
      }
    }
    loadFromLedger();
    
    // Refresh batches every 10 seconds
    const interval = setInterval(loadFromLedger, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/notifications/lab');
        const data: Notification[] = await response.json();
        
        // Sort by timestamp (newest first)
        const sorted = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(sorted);
        
        // Count unread
        const unread = sorted.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (labSession) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [labSession]);

  // DO NOT show login popup - users will see unread count on notification icon
  // Login notification popup removed as per requirement

  const collected = useMemo(() => batches.filter(b => b.status === 'PENDING'), [batches]);

  function handleLogin(labId: string) {
    const session = { labId };
    setLabSession(session);
    localStorage.setItem('labSession', JSON.stringify(session));
    navigate('/lab/dashboard');
  }

  async function handleSubmit(batchId: string, _update: any) {
    // Update local state optimistically
    setBatches(prev => prev.map(b => (b.id === batchId ? { ...b, status: 'TESTED' } : b)));
    
    // Reload from blockchain to get latest data
    try {
      const res = await fetch('http://localhost:3001/events');
      const allEvents: LedgerEvent[] = await res.json();
      const map = new Map<string, { farmer?: LedgerEvent; lab?: LedgerEvent }>();
      for (const ev of allEvents) {
        const e = map.get(ev.batchId) || {} as any;
        if (ev.stage === 'farmer') e.farmer = e.farmer ?? ev;
        if (ev.stage === 'lab') e.lab = e.lab ?? ev;
        map.set(ev.batchId, e);
      }
      const next: LabBatch[] = [];
      for (const [id, info] of map.entries()) {
        if (!info.farmer) continue;
        const f = info.farmer;
        const data: any = f.data || {};
        
        let status = 'PENDING';
        if (info.lab) {
          const labData = info.lab.data || {};
          // Check approvalStatus field first (new system)
          if (labData.approvalStatus === 'rejected') {
            status = 'REJECTED';
          } else if (labData.qualityGrade === 'F' || labData.qualityGrade === 'Rejected') {
            // Fallback for old data
            status = 'REJECTED';
          } else {
            status = 'TESTED';
          }
        }
        
        next.push({
          id,
          productName: data.productName ?? '-',
          farmerName: data.farmerId ?? f.addedBy ?? '-',
          collectionDate: data.harvestedDate ?? f.timestamp ?? '',
          status,
          addedBy: info.lab?.addedBy ?? f.addedBy,
        } as LabBatch);
      }
      setBatches(next);
    } catch (error) {
      console.error('Error reloading batches:', error);
    }
    
    navigate('/lab/dashboard');
  }

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageSelector(false);
    setSidebarView('menu');
  };

  const handleLogout = () => {
    setLabSession(null);
    localStorage.removeItem('labSession');
    setSidebarOpen(false);
    navigate('/lab');
  };

  const menuItems = [
    { icon: Home, label: t('dashboard'), onClick: () => { navigate('/lab/dashboard'); setSidebarOpen(false); }, path: '/lab/dashboard' },
    { icon: FlaskConical, label: t('testNewBatch'), onClick: () => { navigate('/lab/test-new'); setSidebarOpen(false); }, path: '/lab/test-new' },
    { icon: Package, label: t('batches'), onClick: () => setSidebarView('batches'), path: null },
    { icon: PieChart, label: t('reportsAnalytics'), onClick: () => { navigate('/lab/reports'); setSidebarOpen(false); }, path: '/lab/reports' },
  ];

  const settingsItems = [
    { icon: Settings, label: t('settings'), onClick: () => setSidebarView('settings'), isLogout: false, path: null },
    { icon: HelpCircle, label: t('helpSupport'), onClick: () => { navigate('/lab/help-support'); setSidebarOpen(false); }, isLogout: false, path: '/lab/help-support' },
    { icon: LogOut, label: 'Logout', onClick: handleLogout, isLogout: true, path: null },
  ];

  // Notification handlers
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    setSidebarOpen(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
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

  if (showLanguageSelector) {
    return (
      <LanguageSelector
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onBack={() => setShowLanguageSelector(false)}
      />
    );
  }

  // Redirect to login if not authenticated
  if (!labSession) {
    return (
      <div className='min-h-screen bg-white text-gray-900'>
        <Routes>
          <Route path='/' element={<LabLogin onLogin={handleLogin} />} />
          <Route path='/login' element={<LabLogin onLogin={handleLogin} />} />
          <Route path='*' element={<Navigate to='/lab' replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {labSession && (
        <>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='fixed bg-black bg-opacity-30 z-40'
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

          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className='fixed left-6 top-24 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden'
                style={{ height: '525px' }}
              >
                {sidebarView === 'menu' ? (
                  <>
                    {/* Sidebar Header */}
                    <div className='bg-gray-100 px-4 py-3 border-b border-gray-300'>
                      <div className='flex items-center gap-2'>
                        <div className='text-xl'>☰</div>
                        <h2 className='text-base font-bold text-gray-900 uppercase tracking-wide'>{t('options')}</h2>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className='p-3 overflow-y-auto custom-scrollbar' style={{ height: '440px' }}>
                      <div className='mb-2'>
                        {menuItems.map((item, index) => (
                          <motion.button
                            key={index}
                            onClick={item.onClick}
                            whileHover={{ x: 4 }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 mb-1 ${
                              item.path && location.pathname === item.path
                                ? 'bg-gray-200 text-gray-900 font-semibold'
                                : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            <item.icon className='w-5 h-5' />
                            <span className='font-medium text-sm'>{item.label}</span>
                          </motion.button>
                        ))}
                      </div>

                      <div className='my-2'>
                        {settingsItems.map((item, index) => (
                          <motion.button
                            key={index}
                            onClick={item.onClick}
                            whileHover={{ x: 4 }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 mb-1 ${
                              item.isLogout 
                                ? 'text-red-600 hover:bg-red-50 hover:text-red-700 font-medium' 
                                : item.path && (location.pathname === item.path || location.pathname.startsWith('/lab/support'))
                                ? 'bg-gray-200 text-gray-900 font-semibold'
                                : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            <item.icon className='w-5 h-5' />
                            <span className='font-medium text-sm'>{item.label}</span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Account Info */}
                      <div className='mt-4 pt-3 border-t border-gray-300'>
                        <h3 className='text-sm font-bold text-gray-900 mb-2'>{t('accountInfo')}</h3>
                        <div className='space-y-1 text-sm text-gray-800'>
                          <div className='flex items-start'>
                            <span className='text-gray-600'>{t('labId')}: {labSession.labId}</span>
                          </div>
                          <div className='flex items-start'>
                            <span className='text-gray-600'>{t('role')}: {t('labTechnician')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer - Last Login Time */}
                    <div className='bg-gray-100 px-4 py-3 border-t border-gray-300 text-right'>
                      <p className='text-xs text-gray-600'>{t('lastLogin')}: {new Date().toLocaleString()}</p>
                    </div>
                  </>
                ) : sidebarView === 'settings' ? (
                  <>
                    {/* Settings View */}
                    <div className='bg-gray-100 px-4 py-3 border-b border-gray-300'>
                      <div className='flex items-center justify-between'>
                        <button 
                          onClick={() => setSidebarView('menu')}
                          className='text-gray-600 hover:text-gray-900 transition-colors'
                        >
                          <ChevronLeft className='w-6 h-6' />
                        </button>
                        <h2 className='text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2'>
                          <Settings className='w-5 h-5' />
                          {t('settings').toUpperCase()}
                        </h2>
                        <div className='w-6'></div>
                      </div>
                    </div>
                    <div className='p-3 overflow-y-auto custom-scrollbar' style={{ height: '440px' }}>
                      <div className='space-y-2'>
                        <motion.div 
                          whileHover={{ x: 4 }}
                          onClick={() => setShowLanguageSelector(true)}
                          className='px-3 py-2 text-base text-gray-700 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                        >
                          {t('language')}
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/support/report'); setSidebarOpen(false); }}
                          className='px-3 py-2 text-base text-gray-700 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                        >
                          {t('reportIssue')}
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/help-support'); setSidebarOpen(false); }}
                          className='px-3 py-2 text-base text-gray-700 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'
                        >
                          {t('helpSupport')}
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={handleLogout}
                          className='px-3 py-2 text-base text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium'
                        >
                          {t('logout')}
                        </motion.div>
                      </div>
                    </div>
                    <div className='bg-gray-100 px-4 py-3 border-t border-gray-300 text-right'>
                      <p className='text-xs text-gray-600'>{t('lastLogin')}: {new Date().toLocaleString()}</p>
                    </div>
                  </>
                ) : sidebarView === 'batches' ? (
                  <>
                    {/* Batches View */}
                    <div className='bg-gray-100 px-4 py-3 border-b border-gray-300'>
                      <div className='flex items-center justify-between'>
                        <button 
                          onClick={() => setSidebarView('menu')}
                          className='text-gray-600 hover:text-gray-900 transition-colors'
                        >
                          <ChevronLeft className='w-6 h-6' />
                        </button>
                        <h2 className='text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2'>
                          <Package className='w-5 h-5' />
                          {t('batches').toUpperCase()}
                        </h2>
                        <div className='w-6'></div>
                      </div>
                    </div>
                    <div className='p-3 overflow-y-auto custom-scrollbar' style={{ height: '440px' }}>
                      <div className='space-y-2'>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/test-new'); setSidebarOpen(false); }}
                          className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                            location.pathname === '/lab/test-new' 
                              ? 'bg-gray-200 text-gray-900 font-semibold' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {t('pendingTests')}
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/last-tested'); setSidebarOpen(false); }}
                          className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                            location.pathname === '/lab/last-tested' 
                              ? 'bg-gray-200 text-gray-900 font-semibold' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Last Tested
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/tested'); setSidebarOpen(false); }}
                          className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                            location.pathname === '/lab/tested' 
                              ? 'bg-gray-200 text-gray-900 font-semibold' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Tested Batches
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/sent-to-manufacturing'); setSidebarOpen(false); }}
                          className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                            location.pathname === '/lab/sent-to-manufacturing' 
                              ? 'bg-gray-200 text-gray-900 font-semibold' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Sent to Manufacturing
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { navigate('/lab/rejected'); setSidebarOpen(false); }}
                          className={`px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 ${
                            location.pathname === '/lab/rejected' 
                              ? 'bg-gray-200 text-gray-900 font-semibold' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {t('rejectedBatches')}
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          onClick={() => { setSidebarView('help'); }}
                          className='px-3 py-2 text-base cursor-pointer rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        >
                          {t('helpSupport')}
                        </motion.div>
                        <motion.div 
                          whileHover={{ x: 4 }} 
                          className='px-3 py-2 text-base font-medium text-gray-900 bg-blue-50 border-l-4 border-blue-600 rounded-lg flex items-center justify-between'
                        >
                          <span>Batches Tested</span>
                          <span className='text-2xl font-bold text-blue-700'>{batches.filter(b => b.status === 'TESTED').length}</span>
                        </motion.div>
                      </div>
                    </div>
                    <div className='bg-gray-100 px-4 py-3 border-t border-gray-300 text-right'>
                      <p className='text-xs text-gray-600'>{t('lastLogin')}: {new Date().toLocaleString()}</p>
                    </div>
                  </>
                ) : sidebarView === 'help' ? (
                  <>
                    {/* Help & Support View */}
                    <div className='bg-gray-100 px-4 py-3 border-b border-gray-300'>
                      <div className='flex items-center justify-between'>
                        <button 
                          onClick={() => setSidebarView('menu')}
                          className='text-gray-600 hover:text-gray-900 transition-colors'
                        >
                          <ChevronLeft className='w-6 h-6' />
                        </button>
                        <h2 className='text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2'>
                          <HelpCircle className='w-5 h-5' />
                          {t('helpSupport').toUpperCase()}
                        </h2>
                        <div className='w-6'></div>
                      </div>
                    </div>
                    <div className='p-3 overflow-y-auto custom-scrollbar' style={{ height: '440px' }}>
                      <div className='space-y-3'>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className='bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200'
                        >
                          <h3 className='font-bold text-gray-800 mb-2'>Quick Guides</h3>
                          <ul className='space-y-2 text-sm text-gray-600'>
                            <li className='flex items-start gap-2'>
                              <span className='text-blue-600 mt-0.5'>•</span>
                              <span>How to test a new batch</span>
                            </li>
                            <li className='flex items-start gap-2'>
                              <span className='text-blue-600 mt-0.5'>•</span>
                              <span>Understanding quality grades</span>
                            </li>
                            <li className='flex items-start gap-2'>
                              <span className='text-blue-600 mt-0.5'>•</span>
                              <span>Blockchain verification</span>
                            </li>
                          </ul>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className='bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200'
                        >
                          <h3 className='font-bold text-gray-800 mb-2'>Contact Support</h3>
                          <p className='text-sm text-gray-600 leading-relaxed'>
                            Email: support@herbtraceability.com<br />
                            Phone: +91 1800-XXX-XXXX
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    <div className='bg-gray-100 px-4 py-3 border-t border-gray-300 text-right'>
                      <p className='text-xs text-gray-600'>{t('lastLogin')}: {new Date().toLocaleString()}</p>
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          <LabNavbar 
            session={labSession} 
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onDashboardClick={() => { navigate('/lab/dashboard'); setSidebarOpen(false); }}
            onNotificationClick={() => setNotificationSidebarOpen(true)}
            unreadCount={unreadCount}
            sidebarOpen={sidebarOpen}
          />
          <main>
            <Routes>
              <Route path='/' element={<Navigate to='/lab/dashboard' replace />} />
              <Route
                path='/dashboard'
                element={
                  <LabDashboard
                    batches={batches}
                    onSelect={(id) => navigate(`/lab/test/${id}`)}
                  />
                }
              />
              <Route
                path='/test-new'
                element={
                  <TestNewBatch
                    batches={batches}
                    onSubmit={handleSubmit}
                  />
                }
              />
              <Route
                path='/tested'
                element={<TestedBatches />}
              />
              <Route
                path='/approved'
                element={<ApprovedTests />}
              />
              <Route
                path='/manufacturer'
                element={<SentToManufacturer />}
              />
              <Route
                path='/last-tested'
                element={<LastTested />}
              />
              <Route
                path='/sent-to-manufacturing'
                element={<LabSentToManufacturing />}
              />
              <Route
                path='/rejected'
                element={<RejectedBatches batches={batches} />}
              />
              <Route
                path='/reports'
                element={<ReportsAnalytics batches={batches} />}
              />
              <Route
                path='/form/:id'
                element={
                  <LabForm
                    batches={batches}
                    onSubmit={handleSubmit}
                  />
                }
              />
              <Route
                path='/test/:id'
                element={
                  <BatchTestingForm
                    batches={batches}
                    onSubmit={handleSubmit}
                    labTechnicianName={labSession?.labId || 'Lab Technician'}
                  />
                }
              />
              <Route
                path='/help-support'
                element={<HelpSupport session={labSession} />}
              />
              <Route
                path='/support/report'
                element={<ReportIssue session={labSession} />}
              />
              <Route
                path='/support/tickets'
                element={<ViewTickets session={labSession} />}
              />
              <Route path='*' element={<Navigate to='/lab/dashboard' replace />} />
            </Routes>
          </main>
        </>
      )}

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotificationModal && selectedNotification && (
          <LabNotificationModal
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
      <LabNotificationSidebar
        isOpen={notificationSidebarOpen}
        onClose={() => setNotificationSidebarOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
}
