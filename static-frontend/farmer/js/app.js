/* ==========================================================================
   Farmer Portal - Shared shell (header, hamburger sidebar, notifications)
   Static vanilla-JS equivalent of App.jsx + NotificationSidebar/Modal.
   Loaded (non-deferred) in <head> so the auth-guard redirect runs before
   the page paints. Shell UI is built once DOM is ready.
   ========================================================================== */

var AUTH_KEY = 'farmerAuth';
var NOTIF_READ_KEY = 'farmerNotifRead';

/* ---------------------------------------------------------------------- */
/* Auth helpers                                                            */
/* ---------------------------------------------------------------------- */
function getAuth() {
  try {
    var raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function isLoginPage() {
  return /login\.html?$/.test(window.location.pathname) || window.location.pathname.endsWith('/farmer/') || window.location.pathname.endsWith('/farmer');
}

function requireAuth() {
  if (isLoginPage()) return;
  var auth = getAuth();
  if (!auth || !auth.farmerId) {
    window.location.href = 'login.html';
  }
}

// Run immediately (script is not deferred) so unauthenticated visitors are
// redirected before the protected page's markup ever paints.
requireAuth();

function getFarmerData() {
  var auth = getAuth();
  return {
    farmerId: (auth && auth.farmerId) || FARMER_PROFILE.farmerId,
    farmerName: (auth && auth.farmerName) || FARMER_PROFILE.farmerName,
    mobile: FARMER_PROFILE.mobile,
    address: FARMER_PROFILE.address
  };
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'login.html';
}

/* ---------------------------------------------------------------------- */
/* Icons - small hand-rolled lucide-style outline icon set                 */
/* ---------------------------------------------------------------------- */
var ICON_PATHS = {
  home: '<path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/>',
  plusSquare: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  helpCircle: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  arrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  package: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  truck: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6.5L5 18a1.5 1.5 0 0 0 1.3 2.3h11.4A1.5 1.5 0 0 0 19 18l-5-8.5V3"/>',
  factory: '<path d="M2 20h20"/><path d="M4 20V10l6 4v-4l6 4V6l4 3v11"/>',
  trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  alertTriangle: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="8" x2="9" y2="8"/><line x1="15" y1="8" x2="15" y2="8"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22 6 12 13 2 6"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  messageSquare: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  bookOpen: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  video: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  testTube: '<path d="M9 2v17.5a2.5 2.5 0 0 0 5 0V2"/><path d="M4 8h16"/>',
  archive: '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  rotateCcw: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  alertOctagon: '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>',
  alertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
};

function icon(name, size) {
  size = size || 20;
  var body = ICON_PATHS[name] || '';
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
}

/* ---------------------------------------------------------------------- */
/* Toast helper (reusable across pages)                                    */
/* ---------------------------------------------------------------------- */
function showToast(message, isError) {
  var root = document.getElementById('toastRoot');
  if (!root) return;
  root.innerHTML = '<div class="toast' + (isError ? ' error' : '') + '">' +
    icon(isError ? 'xCircle' : 'checkCircle', 24) + '<p>' + message + '</p></div>';
  clearTimeout(showToast._t);
  showToast._t = setTimeout(function () { root.innerHTML = ''; }, 5000);
}

/* ---------------------------------------------------------------------- */
/* Notifications                                                           */
/* ---------------------------------------------------------------------- */
function getNotifReadOverrides() {
  try { return JSON.parse(localStorage.getItem(NOTIF_READ_KEY) || '{}'); } catch (e) { return {}; }
}
function saveNotifReadOverrides(obj) {
  localStorage.setItem(NOTIF_READ_KEY, JSON.stringify(obj));
}
function getNotificationsWithState() {
  var overrides = getNotifReadOverrides();
  return NOTIFICATIONS.map(function (n) {
    return { id: n.id, type: n.type, status: n.status, title: n.title, message: n.message,
      batchId: n.batchId, productName: n.productName, quantity: n.quantity, unit: n.unit,
      qualityGrade: n.qualityGrade, manufacturerName: n.manufacturerName, reason: n.reason,
      timestamp: n.timestamp, isRead: n.isRead || !!overrides[n.id] };
  }).sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
}
function markNotifRead(id) {
  var overrides = getNotifReadOverrides();
  overrides[id] = true;
  saveNotifReadOverrides(overrides);
}
function markAllNotifRead() {
  var overrides = getNotifReadOverrides();
  NOTIFICATIONS.forEach(function (n) { overrides[n.id] = true; });
  saveNotifReadOverrides(overrides);
}
function formatRelativeTime(timestamp) {
  var date = new Date(timestamp);
  var now = new Date();
  var diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return Math.floor(diffSec / 60) + 'm ago';
  if (diffSec < 86400) return Math.floor(diffSec / 3600) + 'h ago';
  if (diffSec < 2592000) return Math.floor(diffSec / 86400) + 'd ago';
  return date.toLocaleDateString();
}
function notifIcon(type) {
  switch (type) {
    case 'BATCH_APPROVED': return icon('checkCircle', 20);
    case 'BATCH_REJECTED': return icon('xCircle', 20);
    case 'SENT_TO_MANUFACTURING': return icon('package', 20);
    default: return icon('bell', 20);
  }
}

/* ---------------------------------------------------------------------- */
/* Shell state                                                             */
/* ---------------------------------------------------------------------- */
var _sidebarOpen = false;
var _sidebarView = 'menu'; // 'menu' | 'settings' | 'orders'
var _notifOpen = false;

function shellHTML() {
  var f = getFarmerData();
  return '' +
    '<div id="sidebarOverlay" class="overlay hidden"></div>' +
    '<div id="menuSidebar" class="floating-sidebar left hidden"></div>' +
    '<header class="app-header">' +
      '<div class="app-header-inner">' +
        '<div class="app-header-left">' +
          '<button id="hamburgerBtn" class="hamburger-btn" aria-label="Toggle menu"><span></span><span></span><span></span></button>' +
          '<div class="flex items-center gap-3">' +
            '<div class="profile-avatar"><div class="profile-avatar-inner"><div class="profile-avatar-head"></div><div class="profile-avatar-body"></div></div></div>' +
            '<div><div class="profile-name">' + f.farmerName + '</div><div class="profile-id">' + f.farmerId + '</div></div>' +
          '</div>' +
        '</div>' +
        '<h1 id="portalTitleBtn" class="app-title">Farmer Portal</h1>' +
        '<button id="bellBtn" class="bell-btn" aria-label="Notifications">' + icon('bell', 24) +
          '<span id="bellBadge" class="bell-badge hidden">0</span></button>' +
      '</div>' +
    '</header>' +
    '<div id="notifSidebar" class="floating-sidebar right hidden"></div>' +
    '<div id="notifModalBackdrop" class="modal-backdrop hidden"></div>' +
    '<div id="toastRoot"></div>';
}

function menuItemHTML(iconName, label, opts) {
  opts = opts || {};
  var cls = 'menu-item' + (opts.active ? ' active' : '') + (opts.logout ? ' logout' : '');
  var attr = opts.href ? ' data-href="' + opts.href + '"' : (opts.action ? ' data-action="' + opts.action + '"' : '');
  return '<a href="#" class="' + cls + '"' + attr + '>' + icon(iconName, 20) + '<span>' + label + '</span></a>';
}

function renderMenuSidebar() {
  var el = document.getElementById('menuSidebar');
  if (!el) return;
  var page = document.body.getAttribute('data-page') || '';
  var f = getFarmerData();

  if (_sidebarView === 'menu') {
    el.innerHTML =
      '<div class="sidebar-header"><div class="sidebar-header-row"><span style="font-size:1.25rem;">&#9776;</span><h2 class="sidebar-title">Options</h2></div></div>' +
      '<div class="sidebar-body custom-scrollbar">' +
        '<div class="menu-divider">' +
          menuItemHTML('home', 'Dashboard', { href: 'dashboard.html', active: page === 'dashboard' }) +
          menuItemHTML('plusSquare', 'Add Product', { href: 'add-product.html', active: page === 'form' }) +
          menuItemHTML('cart', 'Orders', { action: 'view-orders' }) +
        '</div>' +
        '<div class="menu-divider">' +
          menuItemHTML('settings', 'Settings', { action: 'view-settings' }) +
          menuItemHTML('helpCircle', 'Help & Support', { href: 'help-support.html', active: page === 'helpSupport' }) +
          menuItemHTML('logout', 'Logout', { action: 'logout', logout: true }) +
        '</div>' +
        '<div class="account-info">' +
          '<h3>Account Info</h3>' +
          '<div>Farmer ID: ' + f.farmerId + '</div>' +
          '<div>Name: ' + f.farmerName + '</div>' +
          '<div>Mobile No: ' + f.mobile + '</div>' +
          '<div>Address: ' + f.address + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="sidebar-footer"><p>Last Login: 02-11-2025 09:15 AM</p></div>';
  } else if (_sidebarView === 'settings') {
    el.innerHTML =
      '<div class="sidebar-header"><div class="sidebar-header-row between">' +
        '<button class="sidebar-back-btn" data-action="view-menu">' + icon('chevronLeft', 24) + '</button>' +
        '<h2 class="sidebar-title">' + icon('settings', 20) + ' SETTINGS</h2><div style="width:24px;"></div>' +
      '</div></div>' +
      '<div class="sidebar-body custom-scrollbar">' +
        '<div class="settings-link" data-action="language">Language</div>' +
        '<div class="settings-link' + (page === 'reportIssue' ? ' active' : '') + '" data-href="report-issue.html">Report an Issue</div>' +
        '<div class="settings-link' + (page === 'helpSupport' ? ' active' : '') + '" data-href="help-support.html">Help &amp; Support</div>' +
        '<div class="settings-link logout" data-action="logout">Logout</div>' +
      '</div>' +
      '<div class="sidebar-footer"><p>Last login: 02-11-2025 09:15 AM</p></div>';
  } else if (_sidebarView === 'orders') {
    el.innerHTML =
      '<div class="sidebar-header"><div class="sidebar-header-row between">' +
        '<button class="sidebar-back-btn" data-action="view-menu">' + icon('chevronLeft', 24) + '</button>' +
        '<h2 class="sidebar-title">' + icon('cart', 20) + ' ORDERS</h2><div style="width:24px;"></div>' +
      '</div></div>' +
      '<div class="sidebar-body custom-scrollbar">' +
        '<div class="settings-link' + (page === 'activeOrders' ? ' active' : '') + '" data-href="active-orders.html">Active Orders</div>' +
        '<div class="settings-link' + (page === 'lastOrders' ? ' active' : '') + '" data-href="last-orders.html">Last Order</div>' +
        '<div class="settings-link' + (page === 'sentToManufacturing' ? ' active' : '') + '" data-href="sent-to-manufacturing.html">Sent to Manufacturing</div>' +
        '<div class="settings-link' + (page === 'rejectedOrders' ? ' active' : '') + '" data-href="rejected-orders.html">Rejected Orders</div>' +
        '<div class="settings-link' + (page === 'helpSupport' ? ' active' : '') + '" data-href="help-support.html">Help &amp; Support</div>' +
        '<div class="orders-highlight"><span>Orders Sent</span><span class="count">' + DASHBOARD_STATS.totalBatches + '</span></div>' +
      '</div>' +
      '<div class="sidebar-footer"><p>Last login: 02-11-2025 09:15 AM</p></div>';
  }

  // Wire clicks (delegated within this container)
  el.querySelectorAll('[data-href]').forEach(function (node) {
    node.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = node.getAttribute('data-href');
    });
  });
  el.querySelectorAll('[data-action]').forEach(function (node) {
    node.addEventListener('click', function (e) {
      e.preventDefault();
      handleSidebarAction(node.getAttribute('data-action'));
    });
  });
}

function handleSidebarAction(action) {
  if (action === 'view-orders') { _sidebarView = 'orders'; renderMenuSidebar(); }
  else if (action === 'view-settings') { _sidebarView = 'settings'; renderMenuSidebar(); }
  else if (action === 'view-menu') { _sidebarView = 'menu'; renderMenuSidebar(); }
  else if (action === 'logout') { logout(); }
  else if (action === 'language') { showToast('Language settings are not available in this offline demo.'); }
}

function setSidebarOpen(open) {
  _sidebarOpen = open;
  var overlay = document.getElementById('sidebarOverlay');
  var sidebar = document.getElementById('menuSidebar');
  var btn = document.getElementById('hamburgerBtn');
  if (open) {
    renderMenuSidebar();
    overlay.classList.remove('hidden');
    sidebar.classList.remove('hidden');
    btn.classList.add('open');
  } else {
    overlay.classList.add('hidden');
    sidebar.classList.add('hidden');
    btn.classList.remove('open');
  }
}

/* ---------------------------------------------------------------------- */
/* Notification sidebar + modal                                            */
/* ---------------------------------------------------------------------- */
function renderNotifSidebar() {
  var el = document.getElementById('notifSidebar');
  if (!el) return;
  var notifs = getNotificationsWithState();
  var unread = notifs.filter(function (n) { return !n.isRead; }).length;

  var listHTML;
  if (notifs.length === 0) {
    listHTML = '<div class="notif-empty">' + icon('bell', 64) + '<p>No notifications yet</p>' +
      '<p class="sub">You\'ll see updates about your batches here</p></div>';
  } else {
    listHTML = notifs.map(function (n) {
      return '<div class="notif-card' + (n.isRead ? '' : ' unread') + '" data-id="' + n.id + '">' +
        '<div>' + notifIcon(n.type) + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<p class="msg">' + n.message + '</p>' +
          '<div class="meta"><span class="time">' + formatRelativeTime(n.timestamp) + '</span>' +
          (n.isRead ? '' : '<span class="dot"></span>') + '</div>' +
        '</div></div>';
    }).join('');
  }

  el.innerHTML =
    '<div class="sidebar-header">' +
      '<div class="sidebar-header-row between">' +
        '<div class="sidebar-header-row">' + icon('bell', 20) + '<h2 class="sidebar-title">Notifications</h2></div>' +
        '<button id="notifCloseBtn" class="icon-btn">' + icon('x', 20) + '</button>' +
      '</div>' +
      (unread > 0 ? '<div class="sidebar-header-row between mt-2">' +
        '<p class="unread-count-text">' + unread + ' unread message' + (unread > 1 ? 's' : '') + '</p>' +
        '<button id="markAllReadBtn" class="mark-all-btn">Mark all read</button></div>' : '') +
    '</div>' +
    '<div class="sidebar-body custom-scrollbar" style="max-height:calc(100vh - 220px);">' + listHTML + '</div>' +
    '<div class="sidebar-footer"><p>Updated just now</p></div>';

  updateBellBadge(unread);

  var closeBtn = document.getElementById('notifCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', function () { setNotifOpen(false); });
  var markAllBtn = document.getElementById('markAllReadBtn');
  if (markAllBtn) markAllBtn.addEventListener('click', function () { markAllNotifRead(); renderNotifSidebar(); });

  el.querySelectorAll('.notif-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openNotifModal(card.getAttribute('data-id'));
    });
  });
}

function updateBellBadge(unread) {
  var badge = document.getElementById('bellBadge');
  if (!badge) return;
  if (unread > 0) {
    badge.textContent = unread > 9 ? '9+' : String(unread);
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function setNotifOpen(open) {
  _notifOpen = open;
  var el = document.getElementById('notifSidebar');
  if (!el) return;
  if (open) { renderNotifSidebar(); el.classList.remove('hidden'); }
  else { el.classList.add('hidden'); }
}

function openNotifModal(id) {
  var n = getNotificationsWithState().find(function (x) { return x.id === id; });
  if (!n) return;
  var backdrop = document.getElementById('notifModalBackdrop');

  var headClass = n.status === 'approved' ? 'approved' : (n.status === 'rejected' ? 'rejected' : 'info');
  var iconColor = n.type === 'BATCH_APPROVED' ? '#16a34a' : (n.type === 'BATCH_REJECTED' ? '#dc2626' : (n.type === 'SENT_TO_MANUFACTURING' ? '#9333ea' : '#2563eb'));

  var detailsHTML = '<div class="box"><p class="k">Batch ID</p><p class="v">' + (n.batchId || '') + '</p></div>' +
    '<div class="box"><p class="k">Product</p><p class="v">' + (n.productName || '') + '</p></div>';
  if (n.quantity && n.unit) {
    detailsHTML += '<div class="box"><p class="k">Quantity</p><p class="v">' + n.quantity + ' ' + n.unit + '</p></div>';
  }
  if (n.qualityGrade) {
    detailsHTML += '<div class="box"><p class="k">Quality Grade</p><p class="v">Grade ' + n.qualityGrade + '</p></div>';
  }
  if (n.manufacturerName) {
    detailsHTML += '<div class="box full"><p class="k">Manufacturer</p><p class="v">' + n.manufacturerName + '</p></div>';
  }
  if (n.reason) {
    detailsHTML += '<div class="box full"><p class="k">Rejection Reason</p><p class="v" style="color:#dc2626;">' + n.reason + '</p></div>';
  }

  backdrop.innerHTML =
    '<div class="modal-box sm">' +
      '<div class="notif-modal-head ' + headClass + '">' +
        '<span style="color:' + iconColor + ';">' + notifIcon(n.type) + '</span>' +
        '<div style="flex:1;"><h2>' + n.title + '</h2><div class="time">' + icon('clock', 16) + '<span>' + new Date(n.timestamp).toLocaleString() + '</span></div></div>' +
        '<button id="notifModalClose" class="icon-btn">' + icon('x', 20) + '</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div class="section-card" style="padding:1rem;background:#f9fafb;box-shadow:none;border:1px solid #e5e7eb;"><p style="margin:0;color:#1f2937;">' + n.message + '</p></div>' +
        '<div class="notif-detail-grid">' + detailsHTML + '</div>' +
      '</div>' +
      '<div class="modal-actions" style="padding:1rem 1.5rem;background:#f9fafb;border-top:1px solid #e5e7eb;justify-content:flex-end;">' +
        '<button id="notifModalCloseBtn" class="btn btn-outline" style="background:#1f2937;color:#fff;border:none;">Close</button>' +
      '</div>' +
    '</div>';
  backdrop.classList.remove('hidden');

  function closeModal() {
    markNotifRead(id);
    backdrop.classList.add('hidden');
    backdrop.innerHTML = '';
    renderNotifSidebar();
  }
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); }, { once: true });
  document.getElementById('notifModalClose').addEventListener('click', closeModal);
  document.getElementById('notifModalCloseBtn').addEventListener('click', closeModal);
}

/* ---------------------------------------------------------------------- */
/* Init                                                                     */
/* ---------------------------------------------------------------------- */
function initShell() {
  var shellRoot = document.getElementById('app-shell');
  if (!shellRoot) return;
  shellRoot.innerHTML = shellHTML();

  document.getElementById('hamburgerBtn').addEventListener('click', function () {
    setSidebarOpen(!_sidebarOpen);
  });
  document.getElementById('sidebarOverlay').addEventListener('click', function () {
    setSidebarOpen(false);
  });
  document.getElementById('portalTitleBtn').addEventListener('click', function () {
    window.location.href = 'dashboard.html';
  });
  document.getElementById('bellBtn').addEventListener('click', function () {
    setNotifOpen(!_notifOpen);
  });

  updateBellBadge(getNotificationsWithState().filter(function (n) { return !n.isRead; }).length);
}

document.addEventListener('DOMContentLoaded', function () {
  if (isLoginPage()) return;
  initShell();
});
