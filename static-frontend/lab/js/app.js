/* ==========================================================================
   Lab Portal - Shared shell (header, hamburger sidebar, notification
   sidebar), auth guard, icons and small helpers used by every page.
   Standalone static clone - no build step, no backend. Depends on data.js
   being loaded first (LAB_BATCHES, LAB_TRANSLATIONS, labT, LAB_TICKETS).
   ========================================================================== */

/* --------------------------------------------------------------------------
   Icon library (minimal inline SVGs, lucide-style outline icons)
   -------------------------------------------------------------------------- */
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6l-6 10a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-10V3"/>',
  package: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  piechart: '<path d="M21.2 15a9 9 0 1 1-9.2-9.9"/><path d="M12 12l9-2.1A9 9 0 0 0 12 3v9z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  chevronleft: '<path d="M15 18l-6-6 6-6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  x: '<path d="M18 6L6 18"/><path d="M6 6l12 12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  checkcircle: '<circle cx="12" cy="12" r="10"/><path d="M8.5 12.5l2.5 2.5 5-5"/>',
  xcircle: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/>',
  factory: '<path d="M2 20h20"/><path d="M4 20V10l6 4v-4l6 4V6l4 3v11"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  testtube: '<path d="M9 2h6"/><path d="M10 2v13a4 4 0 0 0 8 0V2"/><path d="M8.5 11h7"/>',
  upload: '<path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 20h16"/>',
  download: '<path d="M12 3v13"/><path d="M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  arrowleft: '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
  arrowright: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  alertcircle: '<circle cx="12" cy="12" r="10"/><path d="M12 8v5"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  alerttriangle: '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  filetext: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4H12a8.7 8.7 0 0 1-4-1L3 20l1.1-4A8.4 8.4 0 1 1 21 11.5z"/>',
  star: '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M22 8l-6 4 6 4V8z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  shield: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M9 13l-2 8 5-3 5 3-2-8"/>',
  trending: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
  mappin: '<path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  archive: '<rect x="2" y="4" width="20" height="5" rx="1"/><path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/>',
  barchart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
  droplet: '<path d="M12 2s7 7.5 7 12.5a7 7 0 0 1-14 0C5 9.5 12 2 12 2z"/>',
  beaker: '<path d="M4.5 3h15"/><path d="M6 3v7l-3.5 8a1.5 1.5 0 0 0 1.4 2h16.2a1.5 1.5 0 0 0 1.4-2L18 10V3"/>',
  bug: '<rect x="8" y="6" width="8" height="12" rx="4"/><path d="M12 6V4"/><path d="M8 10H4"/><path d="M8 14H4"/><path d="M16 10h4"/><path d="M16 14h4"/><path d="M9 4l1.5 1.5"/><path d="M15 4l-1.5 1.5"/>',
  dna: '<path d="M6 3s0 6 6 9-6 9-6 9"/><path d="M18 3s0 6-6 9 6 9 6 9"/><path d="M7 8h10"/><path d="M7 16h10"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M12 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>',
  filewarn: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="12" y1="11" x2="12" y2="15"/><line x1="12" y1="17.5" x2="12.01" y2="17.5"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'
};

function icon(name, cls) {
  const body = ICONS[name] || '';
  return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
}

/* --------------------------------------------------------------------------
   Auth guard
   -------------------------------------------------------------------------- */
function getLabAuth() {
  try {
    const raw = localStorage.getItem('labAuth');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function labAuthGuard() {
  const auth = getLabAuth();
  if (!auth) {
    window.location.href = 'login.html';
    return null;
  }
  return auth;
}

function labLogout() {
  localStorage.removeItem('labAuth');
  window.location.href = 'login.html';
}

/* --------------------------------------------------------------------------
   Mock notifications (shared across pages)
   -------------------------------------------------------------------------- */
const LAB_NOTIFICATIONS = [
  {
    id: 'N1', type: 'BATCH_RECEIVED', title: 'New Batch Received',
    message: 'Batch SURTN1201NE (Ashwagandha Root) has been received from farmer Ramesh Kumar and is awaiting testing.',
    batchId: 'SURTN1201NE', productName: 'Ashwagandha Root', farmerName: 'Ramesh Kumar',
    timestamp: '2026-09-02T10:15:00Z', isRead: false, quantity: 50, unit: 'Kg'
  },
  {
    id: 'N2', type: 'BATCH_RECEIVED', title: 'New Batch Received',
    message: 'Batch SURTN1188TU (Turmeric Rhizome) has been received from farmer Suresh Patel and is awaiting testing.',
    batchId: 'SURTN1188TU', productName: 'Turmeric Rhizome', farmerName: 'Suresh Patel',
    timestamp: '2026-09-01T15:40:00Z', isRead: false, quantity: 75, unit: 'Kg'
  },
  {
    id: 'N3', type: 'SENT_TO_MANUFACTURING', title: 'Batch Sent to Manufacturing',
    message: 'Batch SURTN1108GG (Giloy Stem, Grade A) has been forwarded to Himalaya Herbal Works.',
    batchId: 'SURTN1108GG', productName: 'Giloy Stem', manufacturerName: 'Himalaya Herbal Works',
    timestamp: '2026-08-03T09:00:00Z', isRead: true, qualityGrade: 'A'
  },
  {
    id: 'N4', type: 'BATCH_TESTED', title: 'Batch Rejected',
    message: 'Batch SURTN1072PS (Punarnava Whole Plant) was rejected - pesticide residue exceeded safe threshold.',
    batchId: 'SURTN1072PS', productName: 'Punarnava Whole Plant',
    timestamp: '2026-07-20T13:20:00Z', isRead: true, qualityGrade: 'F'
  }
];

function labUnreadCount() {
  return LAB_NOTIFICATIONS.filter(function (n) { return !n.isRead; }).length;
}

function labFormatRelativeTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 2592000) return Math.floor(diff / 86400) + 'd ago';
  return date.toLocaleDateString('en-GB');
}

/* --------------------------------------------------------------------------
   Shared shell: header + hamburger sidebar + notification sidebar
   -------------------------------------------------------------------------- */
const LAB_MENU_ITEMS = [
  { key: 'dashboard', icon: 'home', label: 'Dashboard', href: 'dashboard.html' },
  { key: 'test-new', icon: 'flask', label: 'Test New Batch', href: 'test-new-batch.html' },
  { key: 'batches', icon: 'package', label: 'Batches', href: null },
  { key: 'reports', icon: 'piechart', label: 'Reports & Analytics', href: 'reports-analytics.html' }
];

const LAB_BATCH_SUBMENU = [
  { key: 'test-new', label: 'Pending Tests', href: 'test-new-batch.html' },
  { key: 'last-tested', label: 'Last Tested', href: 'last-tested.html' },
  { key: 'tested', label: 'Tested Batches', href: 'tested-batches.html' },
  { key: 'sent-to-manufacturing', label: 'Sent to Manufacturing', href: 'sent-to-manufacturing.html' },
  { key: 'rejected', label: 'Rejected Batches', href: 'rejected-batches.html' }
];

function labHeaderHtml(auth) {
  return (
    '<header class="lab-header">' +
      '<div class="lab-header-inner">' +
        '<div class="lab-header-left">' +
          '<button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle menu"><span></span><span></span><span></span></button>' +
          '<div class="lab-avatar"><div class="head"></div><div class="body"></div></div>' +
          '<div>' +
            '<div class="lab-header-user-name">Lab Technician</div>' +
            '<div class="lab-header-user-id">' + (auth ? auth.labId : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<a href="dashboard.html" class="lab-header-title">LAB PORTAL</a>' +
        '<button class="notif-btn" id="notifBtn" aria-label="Notifications">' +
          icon('bell') +
          (labUnreadCount() > 0 ? '<span class="notif-badge">' + (labUnreadCount() > 9 ? '9+' : labUnreadCount()) + '</span>' : '') +
        '</button>' +
      '</div>' +
    '</header>'
  );
}

function labMenuItemHtml(item, activeKey) {
  const isActive = item.key === activeKey;
  const tag = item.href ? 'a' : 'button';
  const hrefAttr = item.href ? ' href="' + item.href + '"' : '';
  const onclick = item.href ? '' : ' onclick="labShowSidebarView(\'batches\')"';
  return (
    '<' + tag + ' class="menu-item' + (isActive ? ' active' : '') + '"' + hrefAttr + onclick + '>' +
      icon(item.icon) + '<span>' + item.label + '</span>' +
    '</' + tag + '>'
  );
}

function labSidebarMenuView(auth, activeKey) {
  const testedCount = LAB_BATCHES.filter(function (b) { return b.status === 'TESTED'; }).length;
  let html = '<div class="side-panel-header"><div style="display:flex;align-items:center;gap:.5rem;"><span style="font-size:1.2rem;">☰</span><h2>' + labT('options') + '</h2></div></div>';
  html += '<div class="side-panel-body">';
  html += '<div>';
  LAB_MENU_ITEMS.forEach(function (item) { html += labMenuItemHtml(item, activeKey); });
  html += '</div>';
  html += '<div class="menu-divider"></div>';
  html += '<div>';
  html += '<button class="menu-item" onclick="labShowSidebarView(\'settings\')">' + icon('settings') + '<span>' + labT('settings') + '</span></button>';
  html += '<a class="menu-item' + (activeKey === 'help-support' ? ' active' : '') + '" href="help-support.html">' + icon('help') + '<span>' + labT('helpSupport') + '</span></a>';
  html += '<button class="menu-item logout" onclick="labLogout()">' + icon('logout') + '<span>Logout</span></button>';
  html += '</div>';
  html += '<div class="account-info mt-4" style="padding-top:.75rem;border-top:1px solid var(--gray-300);">';
  html += '<h3>' + labT('accountInfo') + '</h3>';
  html += '<p>' + labT('labId') + ': ' + (auth ? auth.labId : '-') + '</p>';
  html += '<p>' + labT('role') + ': ' + labT('labTechnician') + '</p>';
  html += '</div>';
  html += '</div>';
  html += '<div class="side-panel-footer"><p>' + labT('lastLogin') + ': ' + new Date().toLocaleString() + '</p></div>';
  return html;
}

function labSidebarSettingsView() {
  let html = '<div class="side-panel-header">';
  html += '<button class="side-panel-back" onclick="labShowSidebarView(\'menu\')">' + icon('chevronleft') + '</button>';
  html += '<h2>' + icon('settings') + labT('settings').toUpperCase() + '</h2><div style="width:24px;"></div>';
  html += '</div>';
  html += '<div class="side-panel-body">';
  html += '<div class="menu-item" style="cursor:pointer;" onclick="alert(\'Language selection is a visual demo only in this static build.\')">' + labT('language') + '</div>';
  html += '<a class="menu-item" href="report-issue.html">' + labT('reportIssue') + '</a>';
  html += '<a class="menu-item" href="help-support.html">' + labT('helpSupport') + '</a>';
  html += '<div class="menu-item logout" style="cursor:pointer;" onclick="labLogout()">' + labT('logout') + '</div>';
  html += '</div>';
  html += '<div class="side-panel-footer"><p>' + labT('lastLogin') + ': ' + new Date().toLocaleString() + '</p></div>';
  return html;
}

function labSidebarBatchesView(activeKey) {
  const testedCount = LAB_BATCHES.filter(function (b) { return b.status === 'TESTED'; }).length;
  let html = '<div class="side-panel-header">';
  html += '<button class="side-panel-back" onclick="labShowSidebarView(\'menu\')">' + icon('chevronleft') + '</button>';
  html += '<h2>' + icon('package') + labT('batches').toUpperCase() + '</h2><div style="width:24px;"></div>';
  html += '</div>';
  html += '<div class="side-panel-body">';
  LAB_BATCH_SUBMENU.forEach(function (item) {
    html += '<a class="menu-item' + (item.key === activeKey ? ' active' : '') + '" href="' + item.href + '">' + item.label + '</a>';
  });
  html += '<a class="menu-item" href="help-support.html">' + labT('helpSupport') + '</a>';
  html += '<div class="batches-count-row mt-2"><span>Batches Tested</span><span class="count">' + testedCount + '</span></div>';
  html += '</div>';
  html += '<div class="side-panel-footer"><p>' + labT('lastLogin') + ': ' + new Date().toLocaleString() + '</p></div>';
  return html;
}

function labSidebarHelpView() {
  let html = '<div class="side-panel-header">';
  html += '<button class="side-panel-back" onclick="labShowSidebarView(\'menu\')">' + icon('chevronleft') + '</button>';
  html += '<h2>' + icon('help') + labT('helpSupport').toUpperCase() + '</h2><div style="width:24px;"></div>';
  html += '</div>';
  html += '<div class="side-panel-body">';
  html += '<div class="help-card"><h3>Quick Guides</h3><ul><li>How to test a new batch</li><li>Understanding quality grades</li><li>Blockchain verification</li></ul></div>';
  html += '<div class="help-card"><h3>Contact Support</h3><p style="font-size:.85rem;color:var(--gray-600);margin:0;">Email: support@herbtraceability.com<br>Phone: +91 1800-XXX-XXXX</p></div>';
  html += '</div>';
  html += '<div class="side-panel-footer"><p>' + labT('lastLogin') + ': ' + new Date().toLocaleString() + '</p></div>';
  return html;
}

function labShowSidebarView(view) {
  const panel = document.getElementById('menuSidePanel');
  if (!panel) return;
  const auth = getLabAuth();
  const activeKey = panel.getAttribute('data-active-key') || '';
  if (view === 'menu') panel.innerHTML = labSidebarMenuView(auth, activeKey);
  else if (view === 'settings') panel.innerHTML = labSidebarSettingsView();
  else if (view === 'batches') panel.innerHTML = labSidebarBatchesView(activeKey);
  else if (view === 'help') panel.innerHTML = labSidebarHelpView();
}

function labNotifSidebarHtml() {
  let html = '<div class="side-panel-header">';
  html += '<h2>' + icon('bell') + 'Notifications</h2>';
  html += '<button class="side-panel-back" onclick="labToggleNotifPanel(false)">' + icon('x') + '</button>';
  html += '</div>';
  const unread = labUnreadCount();
  if (unread > 0) {
    html += '<div style="padding:.5rem 1rem;background:var(--gray-100);border-bottom:1px solid var(--gray-300);display:flex;align-items:center;justify-content:space-between;">';
    html += '<p style="margin:0;font-size:.75rem;color:var(--gray-600);">' + unread + ' unread message' + (unread > 1 ? 's' : '') + '</p>';
    html += '<button class="mark-all-btn" onclick="labMarkAllRead()">Mark all read</button>';
    html += '</div>';
  }
  html += '<div class="side-panel-body">';
  if (LAB_NOTIFICATIONS.length === 0) {
    html += '<div class="notif-empty">' + icon('bell') + '<p>No notifications yet</p></div>';
  } else {
    LAB_NOTIFICATIONS.forEach(function (n) {
      html += '<div class="notif-item' + (n.isRead ? '' : ' unread') + '" onclick="labOpenNotifModal(\'' + n.id + '\')">';
      html += '<div class="notif-icon">' + icon(n.type === 'BATCH_RECEIVED' ? 'flask' : n.type === 'SENT_TO_MANUFACTURING' ? 'package' : 'bell') + '</div>';
      html += '<div style="flex:1;"><p class="notif-text">' + n.message + '</p>';
      html += '<div class="notif-meta"><span class="notif-time">' + labFormatRelativeTime(n.timestamp) + '</span>';
      if (!n.isRead) html += '<span class="notif-dot"></span>';
      html += '</div></div></div>';
    });
  }
  html += '</div>';
  html += '<div class="side-panel-footer"><p>Updated just now</p></div>';
  return html;
}

function labToggleNotifPanel(forceState) {
  const panel = document.getElementById('notifSidePanel');
  const overlay = document.getElementById('labOverlay');
  if (!panel) return;
  const isOpen = panel.classList.contains('hidden') === false;
  const next = typeof forceState === 'boolean' ? forceState : !isOpen;
  if (next) {
    panel.innerHTML = labNotifSidebarHtml();
    panel.classList.remove('hidden');
    if (overlay) overlay.classList.remove('hidden');
    labCloseMenuPanel();
  } else {
    panel.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
  }
}

function labToggleMenuPanel() {
  const panel = document.getElementById('menuSidePanel');
  const overlay = document.getElementById('labOverlay');
  const btn = document.getElementById('hamburgerBtn');
  if (!panel) return;
  const isOpen = panel.classList.contains('hidden') === false;
  if (isOpen) {
    labCloseMenuPanel();
  } else {
    panel.classList.remove('hidden');
    if (overlay) overlay.classList.remove('hidden');
    if (btn) btn.classList.add('open');
    labToggleNotifPanel(false);
  }
}

function labCloseMenuPanel() {
  const panel = document.getElementById('menuSidePanel');
  const overlay = document.getElementById('labOverlay');
  const btn = document.getElementById('hamburgerBtn');
  if (panel) panel.classList.add('hidden');
  if (overlay) overlay.classList.add('hidden');
  if (btn) btn.classList.remove('open');
}

function labMarkAllRead() {
  LAB_NOTIFICATIONS.forEach(function (n) { n.isRead = true; });
  labToggleNotifPanel(true);
  const badge = document.querySelector('.notif-badge');
  if (badge) badge.remove();
}

function labOpenNotifModal(id) {
  const n = LAB_NOTIFICATIONS.find(function (x) { return x.id === id; });
  if (!n) return;
  n.isRead = true;
  const overlay = document.getElementById('labOverlay');
  labToggleNotifPanel(false);
  const modal = document.getElementById('notifModal');
  const iconName = n.type === 'BATCH_RECEIVED' ? 'package' : n.type === 'SENT_TO_MANUFACTURING' ? 'factory' : 'flask';
  let html = '<div class="modal-box">';
  html += '<div class="modal-head"><div style="display:flex;align-items:center;gap:1rem;">' + icon(iconName, '') + '<div><h2 style="margin:0;font-size:1.2rem;font-weight:700;">' + n.title + '</h2>';
  html += '<div style="display:flex;align-items:center;gap:.4rem;font-size:.85rem;color:var(--gray-600);margin-top:.25rem;">' + icon('clock') + new Date(n.timestamp).toLocaleString('en-IN') + '</div></div></div>';
  html += '<button class="close-x" onclick="labCloseNotifModal()">' + icon('x') + '</button></div>';
  html += '<div class="modal-body">';
  html += '<div class="notif-modal-msg">' + n.message + '</div>';
  html += '<div class="notif-detail-grid">';
  html += '<div class="notif-detail-item"><p class="dlabel">Batch ID</p><p class="dvalue">' + n.batchId + '</p></div>';
  html += '<div class="notif-detail-item"><p class="dlabel">Product</p><p class="dvalue">' + n.productName + '</p></div>';
  if (n.farmerName) html += '<div class="notif-detail-item span-2"><p class="dlabel">Farmer</p><p class="dvalue">' + n.farmerName + '</p></div>';
  if (n.quantity && n.unit) html += '<div class="notif-detail-item"><p class="dlabel">Quantity</p><p class="dvalue">' + n.quantity + ' ' + n.unit + '</p></div>';
  if (n.qualityGrade) html += '<div class="notif-detail-item"><p class="dlabel">Quality Grade</p><p class="dvalue">Grade ' + n.qualityGrade + '</p></div>';
  if (n.manufacturerName) html += '<div class="notif-detail-item span-2"><p class="dlabel">Manufacturer</p><p class="dvalue">' + n.manufacturerName + '</p></div>';
  html += '</div></div>';
  html += '<div class="modal-foot"><button class="btn btn-gray" style="background:#1f2937;color:#fff;" onclick="labCloseNotifModal()">Close</button></div>';
  html += '</div>';
  modal.innerHTML = html;
  modal.classList.add('open');
}

function labCloseNotifModal() {
  const modal = document.getElementById('notifModal');
  if (modal) modal.classList.remove('open');
}

/* --------------------------------------------------------------------------
   Shell bootstrap - call once per page (except login)
   -------------------------------------------------------------------------- */
function initLabShell(activeKey) {
  const auth = labAuthGuard();
  if (!auth) return null;

  const shell = document.getElementById('app-shell');
  if (!shell) return auth;

  let html = labHeaderHtml(auth);
  html += '<div id="labOverlay" class="overlay hidden" onclick="labCloseMenuPanel(); labToggleNotifPanel(false);"></div>';
  html += '<div id="menuSidePanel" class="side-panel menu-panel hidden" data-active-key="' + activeKey + '">' + labSidebarMenuView(auth, activeKey) + '</div>';
  html += '<div id="notifSidePanel" class="side-panel notif-panel hidden"></div>';
  html += '<div id="notifModal" class="modal-overlay"></div>';
  shell.innerHTML = html;

  document.getElementById('hamburgerBtn').addEventListener('click', labToggleMenuPanel);
  document.getElementById('notifBtn').addEventListener('click', function () { labToggleNotifPanel(); });
  document.getElementById('notifModal').addEventListener('click', function (e) {
    if (e.target === this) labCloseNotifModal();
  });

  return auth;
}

/* --------------------------------------------------------------------------
   Small shared formatting helpers used by page scripts
   -------------------------------------------------------------------------- */
function labFormatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB');
}

function labGradeClass(grade) {
  if (grade === 'A') return 'grade-a';
  if (grade === 'B') return 'grade-b';
  if (grade === 'C') return 'grade-c';
  if (grade === 'F' || grade === 'Rejected') return 'grade-f';
  return 'grade-na';
}

function labBadgeForStatus(status) {
  if (status === 'PENDING') return '<span class="badge badge-orange">Pending Test</span>';
  if (status === 'TESTED') return '<span class="badge badge-green">Tested</span>';
  if (status === 'REJECTED') return '<span class="badge badge-red">Rejected</span>';
  return '<span class="badge badge-gray">' + status + '</span>';
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
