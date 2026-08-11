import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Settings, HelpCircle, ChevronLeft, Bell, User, Globe,
  Package, Clock, CheckCircle, XCircle, LogOut, Menu
} from 'lucide-react';
import { ManufacturerNavbar } from './components/ManufacturerNavbar';
import { ManufacturerLogin } from './pages/ManufacturerLogin';
import { ManufacturerDashboard } from './pages/ManufacturerDashboard';
import { ManufacturerProductionOrders } from './pages/ManufacturerProductionOrders';
import { ManufacturerCompletedOrders } from './pages/ManufacturerCompletedOrders';
import { ManufacturerApprovedByLab } from './pages/ManufacturerApprovedByLab';
import { ManufacturerActiveBatches } from './pages/ManufacturerActiveBatches';
import { ManufacturerProductsManufactured } from './pages/ManufacturerProductsManufactured';
import { ManufacturerDispatchedOrders } from './pages/ManufacturerDispatchedOrders';
import ManufacturerNotificationSidebar from './components/ManufacturerNotificationSidebar';
import { ManufacturerNotificationModal } from './components/ManufacturerNotificationModal';

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
  grade?: string;
  quantity?: string;
  unit?: string;
}

export function ManufacturerApp() {
  const [manufacturerSession, setManufacturerSession] = useState<{ manufacturerId: string } | null>(() => {
    const saved = localStorage.getItem('manufacturerSession');
    return saved ? JSON.parse(saved) : null;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<'menu' | 'settings' | 'help'>('menu');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationSidebarOpen, setNotificationSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3001/notifications/manufacturer');
        const data: Notification[] = await response.json();
        setNotifications(data.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
        
        const unread = data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (manufacturerSession) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [manufacturerSession]);

  const handleLogin = (manufacturerId: string) => {
    const session = { manufacturerId };
    setManufacturerSession(session);
    localStorage.setItem('manufacturerSession', JSON.stringify(session));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setManufacturerSession(null);
    localStorage.removeItem('manufacturerSession');
    setSidebarOpen(false);
    navigate('/');
  };

  const handleNotificationClick = async (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
    
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`http://localhost:3001/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
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

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', onClick: () => { navigate('/dashboard'); setSidebarOpen(false); }, path: '/dashboard' },
    { icon: Package, label: 'Production Orders', onClick: () => { navigate('/production-orders'); setSidebarOpen(false); }, path: '/production-orders' },
    { icon: CheckCircle, label: 'Completed', onClick: () => { navigate('/completed'); setSidebarOpen(false); }, path: '/completed' },
  ];

  const settingsItems = [
    { icon: Settings, label: 'Settings', onClick: () => setSidebarView('settings'), isLogout: false },
    { icon: HelpCircle, label: 'Help & Support', onClick: () => setSidebarView('help'), isLogout: false },
    { icon: LogOut, label: 'Logout', onClick: handleLogout, isLogout: true },
  ];

  // Redirect to login if not authenticated
  if (!manufacturerSession) {
    return (
      <div className='min-h-screen bg-white text-gray-900'>
        <Routes>
          <Route path='/' element={<ManufacturerLogin onLogin={handleLogin} />} />
          <Route path='/login' element={<ManufacturerLogin onLogin={handleLogin} />} />
          <Route path='*' element={<Navigate to='/manufacturer' replace />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white text-gray-900'>
      {manufacturerSession && (
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
                initial={{ x: -350, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -350, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className='fixed left-6 top-24 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden'
                style={{ maxHeight: 'calc(100vh - 120px)' }}
              >
                {sidebarView === 'menu' ? (
                  <>
                    <div className='bg-gray-100 px-4 py-3 border-b border-gray-300'>
                      <div className='flex items-center gap-2'>
                        <div className='text-xl'>☰</div>
                        <h2 className='text-base font-bold text-gray-900 uppercase tracking-wide'>Options</h2>
                      </div>
                    </div>

                    <div className='p-3 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 220px)' }}>
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
                                : 'hover:bg-gray-100 text-gray-900'
                            }`}
                          >
                            <item.icon className='w-5 h-5' />
                            <span className='font-medium text-sm'>{item.label}</span>
                          </motion.button>
                        ))}
                      </div>

                      <div className='mt-4 pt-3 border-t border-gray-300'>
                        <h3 className='text-sm font-bold text-gray-900 mb-2'>Account Info</h3>
                        <div className='space-y-1 text-sm text-gray-800'>
                          <div className='flex items-start'>
                            <span className='text-gray-600'>Manufacturer ID: {manufacturerSession.manufacturerId}</span>
                          </div>
                          <div className='flex items-start'>
                            <span className='text-gray-600'>Role: Production Manager</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='bg-gray-100 px-4 py-3 border-t border-gray-300 text-right'>
                      <p className='text-xs text-gray-600'>Last Login: {new Date().toLocaleString()}</p>
                    </div>
                  </>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          <ManufacturerNavbar 
            session={manufacturerSession} 
            onLogout={handleLogout}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onDashboardClick={() => { navigate('/dashboard'); setSidebarOpen(false); }}
            onNotificationClick={() => setNotificationSidebarOpen(true)}
            unreadCount={unreadCount}
          />

          <main>
            <Routes>
              <Route path='/' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<ManufacturerDashboard manufacturerId={manufacturerSession.manufacturerId} />} />
              <Route path='/production-orders' element={<ManufacturerProductionOrders />} />
              <Route path='/completed' element={<ManufacturerCompletedOrders />} />
              <Route path='/approved-by-lab' element={<ManufacturerApprovedByLab />} />
              <Route path='/active-batches' element={<ManufacturerActiveBatches />} />
              <Route path='/manufactured' element={<ManufacturerProductsManufactured />} />
              <Route path='/dispatched' element={<ManufacturerDispatchedOrders />} />
              <Route path='*' element={<Navigate to='/dashboard' replace />} />
            </Routes>
          </main>
        </>
      )}

      {/* Notification Modal */}
      <AnimatePresence>
        {showNotificationModal && selectedNotification && (
          <ManufacturerNotificationModal
            notification={selectedNotification}
            onClose={() => {
              setShowNotificationModal(false);
              setSelectedNotification(null);
            }}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </AnimatePresence>

      {/* Notification Sidebar */}
      <ManufacturerNotificationSidebar
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
