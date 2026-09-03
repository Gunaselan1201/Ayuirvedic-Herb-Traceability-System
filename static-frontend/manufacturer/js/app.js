/* ==========================================================================
   Manufacturer Portal - Shared shell (navbar, hamburger menu, notifications)
   Injected into #app-shell on every page except login.html.
   Depends on js/data.js being loaded first.
   ========================================================================== */

(function (global) {
  'use strict';

  var AUTH_KEY = 'manufacturerAuth';

  // ---- Minimal inline icon set (stroke-style, 24x24 viewBox) -------------
  var ICON = {
    menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    factory: '<path d="M2 20h20"/><path d="M4 20V10l5 3v-3l5 3v-3l5 3v7"/><path d="M4 20V7l3-2v5"/>',
    home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
    package: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.96a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.04 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.36.5 1.04 1.56 1.04H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.9.7c0 1.6-2.4 2-2.4 3.3"/><path d="M12 17h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.7 13.6 7 22l5-3 5 3-1.7-8.4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    beaker: '<path d="M9 3h6"/><path d="M10 3v6l-5.5 9.5A1 1 0 0 0 5.4 20h13.2a1 1 0 0 0 .9-1.5L14 9V3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    truck: '<rect x="1" y="6" width="14" height="11" rx="1"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    checkCircle2: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-5"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
    hash: '<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
    trending: '<path d="M3 17l6-6 4 4 8-8"/><path d="M17 7h4v4"/>',
    alertCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>'
  };

  function svg(name, extraClass) {
    var body = ICON[name] || '';
    return '<svg class="' + (extraClass || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  }

  // ---- Auth -----------------------------------------------------------
  function getSession() {
    try {
      var raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function requireAuth() {
    var session = getSession();
    if (!session || !session.manufacturerId) {
      window.location.href = 'login.html';
      return null;
    }
    return session;
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'login.html';
  }

  // ---- Notifications state --------------------------------------------
  var notifications = (global.MFR_DATA && global.MFR_DATA.MOCK_NOTIFICATIONS) ? global.MFR_DATA.MOCK_NOTIFICATIONS.slice() : [];

  function unreadCount() {
    return notifications.filter(function (n) { return !n.isRead; }).length;
  }

  function notifIcon(type) {
    if (type === 'BATCH_SENT_TO_MANUFACTURING') return svg('package');
    if (type === 'BATCH_APPROVED') return svg('checkCircle');
    if (type === 'PRODUCTION_UPDATE') return svg('alertCircle');
    return svg('bell');
  }

  // ---- Menu items -------------------------------------------------------
  var MENU_ITEMS = [
    { icon: 'home', label: 'Dashboard', href: 'dashboard.html' },
    { icon: 'package', label: 'Production Orders', href: 'production-orders.html' },
    { icon: 'checkCircle', label: 'Completed', href: 'completed-orders.html' }
  ];

  function currentPageHref() {
    var path = window.location.pathname.split('/').pop() || 'dashboard.html';
    return path;
  }

  // ---- Shell markup -------------------------------------------------------
  function shellHtml(session) {
    var current = currentPageHref();
    var menuHtml = MENU_ITEMS.map(function (item) {
      var active = item.href === current ? ' active' : '';
      return '<a class="menu-item' + active + '" href="' + item.href + '">' + svg(item.icon) + '<span>' + item.label + '</span></a>';
    }).join('');

    var lastLogin = new Date().toLocaleString();

    return (
      '<div class="backdrop" id="menuBackdrop"></div>' +
      '<div class="side-panel" id="sidePanel">' +
        '<div id="sidePanelMenuView">' +
          '<div class="panel-header"><span class="hash">&#9776;</span><h2>Options</h2></div>' +
          '<div class="panel-body">' +
            '<div class="menu-group">' + menuHtml + '</div>' +
            '<div class="menu-divider"></div>' +
            '<div class="menu-group">' +
              '<button type="button" class="menu-item" id="btnOpenSettings">' + svg('settings') + '<span>Settings</span></button>' +
              '<button type="button" class="menu-item" id="btnOpenHelp">' + svg('help') + '<span>Help &amp; Support</span></button>' +
              '<button type="button" class="menu-item logout" id="btnLogout">' + svg('logout') + '<span>Logout</span></button>' +
            '</div>' +
            '<div class="account-info">' +
              '<h3>Account Info</h3>' +
              '<p>Manufacturer ID: ' + escapeHtml(session.manufacturerId) + '</p>' +
              '<p>Role: Production Manager</p>' +
            '</div>' +
          '</div>' +
          '<div class="panel-footer"><p>Last Login: ' + lastLogin + '</p></div>' +
        '</div>' +
        '<div id="sidePanelSettingsView" class="hidden">' +
          '<div class="panel-header"><h2>Settings</h2></div>' +
          '<div class="panel-body settings-content">' +
            '<button type="button" class="settings-back" data-back>&larr; Back to menu</button>' +
            '<p>Manufacturer ID: <strong>' + escapeHtml(session.manufacturerId) + '</strong></p>' +
            '<p>Notifications: Enabled</p>' +
            '<p>Language: English</p>' +
          '</div>' +
        '</div>' +
        '<div id="sidePanelHelpView" class="hidden">' +
          '<div class="panel-header"><h2>Help &amp; Support</h2></div>' +
          '<div class="panel-body settings-content">' +
            '<button type="button" class="settings-back" data-back>&larr; Back to menu</button>' +
            '<p>Need assistance with production orders or batches?</p>' +
            '<p>Contact your system administrator or the support desk at support@herbaltrace.example for help.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="backdrop-full" id="notifBackdrop"></div>' +
      '<div class="notif-panel" id="notifPanel">' +
        '<div class="panel-header">' +
          '<div style="display:flex;align-items:center;gap:8px;">' + svg('bell') + '<h2>Notifications</h2>' +
          (unreadCount() > 0 ? '<span class="notif-badge" style="position:static;">' + unreadCount() + '</span>' : '') +
          '</div>' +
          '<button type="button" class="icon-btn" style="color:var(--gray-600);" id="btnCloseNotif">' + svg('x') + '</button>' +
        '</div>' +
        (unreadCount() > 0 ? '<div class="notif-actions"><button type="button" id="btnMarkAllRead">Mark all as read</button></div>' : '') +
        '<div class="notif-list" id="notifList"></div>' +
      '</div>' +

      '<div class="modal-backdrop" id="notifModalBackdrop">' +
        '<div class="modal-box" id="notifModalBox"></div>' +
      '</div>' +

      '<nav class="navbar">' +
        '<div class="navbar-inner">' +
          '<div class="navbar-left">' +
            '<button type="button" class="icon-btn" id="btnMenu" aria-label="Open menu" title="Open menu">' + svg('menu') + '</button>' +
            '<a class="brand" href="dashboard.html">' + svg('factory') +
              '<div><p class="brand-title">Manufacturer Portal</p><p class="brand-sub">Production Management</p></div>' +
            '</a>' +
          '</div>' +
          '<div class="navbar-right">' +
            '<button type="button" class="icon-btn" id="btnNotif" aria-label="Open notifications" title="Open notifications">' + svg('bell') +
              (unreadCount() > 0 ? '<span class="notif-badge" id="navBadge">' + unreadCount() + '</span>' : '<span class="notif-badge hidden" id="navBadge"></span>') +
            '</button>' +
            '<div class="user-chip">ID: ' + escapeHtml(session.manufacturerId) + '</div>' +
          '</div>' +
        '</div>' +
      '</nav>'
    );
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderNotifList() {
    var listEl = document.getElementById('notifList');
    if (!listEl) return;
    if (notifications.length === 0) {
      listEl.innerHTML = '<div class="notif-empty">' + svg('bell') + '<p>No notifications yet</p></div>';
      return;
    }
    listEl.innerHTML = notifications.map(function (n) {
      return (
        '<div class="notif-item' + (n.isRead ? '' : ' unread') + '" data-id="' + n.id + '">' +
          '<div class="notif-icon">' + notifIcon(n.type) + '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div class="notif-title-row"><p class="notif-title">' + escapeHtml(n.title) + '</p>' + (n.isRead ? '' : '<span class="notif-dot"></span>') + '</div>' +
            '<p class="notif-msg">' + escapeHtml(n.message) + '</p>' +
            '<div class="notif-meta"><span>Batch: ' + escapeHtml(n.batchId) + '</span><span>' + new Date(n.timestamp).toLocaleDateString() + '</span></div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function updateBadge() {
    var badge = document.getElementById('navBadge');
    var count = unreadCount();
    if (!badge) return;
    if (count > 0) {
      badge.textContent = String(count);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
    var panelBadge = document.querySelector('#notifPanel .panel-header .notif-badge');
    if (panelBadge) panelBadge.textContent = String(count);
    var actions = document.querySelector('.notif-actions');
    if (actions) actions.style.display = count > 0 ? '' : 'none';
  }

  function openNotifModal(n) {
    var box = document.getElementById('notifModalBox');
    var backdrop = document.getElementById('notifModalBackdrop');
    if (!box || !backdrop) return;

    var rows = '';
    rows += '<div class="modal-detail-row" style="background:var(--amber-50);">' + svg('hash') + '<div><p class="label">Batch ID</p><p class="value">' + escapeHtml(n.batchId) + '</p></div></div>';
    rows += '<div class="modal-detail-row" style="background:var(--orange-50);">' + svg('package') + '<div><p class="label">Product</p><p class="value">' + escapeHtml(n.productName) + '</p></div></div>';
    if (n.grade) {
      rows += '<div class="modal-detail-row" style="background:var(--green-50);">' + svg('checkCircle') + '<div><p class="label">Quality Grade</p><p class="value">Grade ' + escapeHtml(n.grade) + '</p></div></div>';
    }
    if (n.farmerName) {
      rows += '<div class="modal-detail-row" style="background:var(--blue-50);">' + svg('user') + '<div><p class="label">Farmer</p><p class="value">' + escapeHtml(n.farmerName) + '</p>' + (n.farmerId ? '<p style="font-size:12px;color:var(--gray-600);margin:2px 0 0;">ID: ' + escapeHtml(n.farmerId) + '</p>' : '') + '</div></div>';
    }
    if (n.quantity && n.unit) {
      rows += '<div class="modal-detail-row" style="background:var(--purple-50);">' + svg('package') + '<div><p class="label">Quantity</p><p class="value">' + escapeHtml(n.quantity) + ' ' + escapeHtml(n.unit) + '</p></div></div>';
    }
    rows += '<div class="modal-detail-row" style="background:var(--gray-50);">' + svg('calendar') + '<div><p class="label">Received</p><p class="value">' + new Date(n.timestamp).toLocaleString() + '</p></div></div>';

    box.innerHTML =
      '<div class="modal-header">' +
        '<div><h2>' + escapeHtml(n.title) + '</h2><p>' + new Date(n.timestamp).toLocaleString() + '</p></div>' +
        '<button type="button" class="icon-btn" id="btnCloseModal">' + svg('x') + '</button>' +
      '</div>' +
      '<div class="modal-body">' +
        '<div><h3>Message</h3><p style="color:var(--gray-900);line-height:1.6;">' + escapeHtml(n.message) + '</p></div>' +
        '<div>' + rows + '</div>' +
      '</div>' +
      '<div class="modal-footer"><button type="button" class="btn-gradient" id="btnCloseModal2">Close</button></div>';

    backdrop.classList.add('show');

    function closeModal() {
      backdrop.classList.remove('show');
    }
    document.getElementById('btnCloseModal').onclick = closeModal;
    document.getElementById('btnCloseModal2').onclick = closeModal;
    backdrop.onclick = function (e) { if (e.target === backdrop) closeModal(); };
  }

  function markAsRead(id) {
    notifications = notifications.map(function (n) {
      return n.id === id ? Object.assign({}, n, { isRead: true }) : n;
    });
    renderNotifList();
    updateBadge();
  }

  function markAllAsRead() {
    notifications = notifications.map(function (n) { return Object.assign({}, n, { isRead: true }); });
    renderNotifList();
    updateBadge();
  }

  // ---- Wire up interactions ------------------------------------------
  function wireShell(session) {
    var sidePanel = document.getElementById('sidePanel');
    var menuBackdrop = document.getElementById('menuBackdrop');
    var notifPanel = document.getElementById('notifPanel');
    var notifBackdrop = document.getElementById('notifBackdrop');

    function closeMenu() {
      sidePanel.classList.remove('show');
      menuBackdrop.classList.remove('show');
    }
    function closeNotif() {
      notifPanel.classList.remove('show');
      notifBackdrop.classList.remove('show');
    }
    function showMenuView() {
      document.getElementById('sidePanelMenuView').classList.remove('hidden');
      document.getElementById('sidePanelSettingsView').classList.add('hidden');
      document.getElementById('sidePanelHelpView').classList.add('hidden');
    }

    document.getElementById('btnMenu').addEventListener('click', function () {
      var isOpen = sidePanel.classList.contains('show');
      if (isOpen) { closeMenu(); return; }
      closeNotif();
      showMenuView();
      sidePanel.classList.add('show');
      menuBackdrop.classList.add('show');
    });
    menuBackdrop.addEventListener('click', closeMenu);

    document.getElementById('btnNotif').addEventListener('click', function () {
      var isOpen = notifPanel.classList.contains('show');
      if (isOpen) { closeNotif(); return; }
      closeMenu();
      renderNotifList();
      notifPanel.classList.add('show');
      notifBackdrop.classList.add('show');
    });
    notifBackdrop.addEventListener('click', closeNotif);
    document.getElementById('btnCloseNotif').addEventListener('click', closeNotif);

    document.getElementById('btnOpenSettings').addEventListener('click', function () {
      document.getElementById('sidePanelMenuView').classList.add('hidden');
      document.getElementById('sidePanelSettingsView').classList.remove('hidden');
    });
    document.getElementById('btnOpenHelp').addEventListener('click', function () {
      document.getElementById('sidePanelMenuView').classList.add('hidden');
      document.getElementById('sidePanelHelpView').classList.remove('hidden');
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-back]'), function (btn) {
      btn.addEventListener('click', showMenuView);
    });
    document.getElementById('btnLogout').addEventListener('click', logout);

    var markAllBtn = document.getElementById('btnMarkAllRead');
    if (markAllBtn) markAllBtn.addEventListener('click', markAllAsRead);

    document.getElementById('notifList').addEventListener('click', function (e) {
      var item = e.target.closest('.notif-item');
      if (!item) return;
      var id = item.getAttribute('data-id');
      var n = notifications.filter(function (x) { return x.id === id; })[0];
      if (!n) return;
      if (!n.isRead) markAsRead(id);
      openNotifModal(n);
    });

    renderNotifList();
  }

  // ---- Public init ------------------------------------------------------
  function init() {
    var session = requireAuth();
    if (!session) return null;
    var shell = document.getElementById('app-shell');
    if (shell) {
      shell.innerHTML = shellHtml(session);
      wireShell(session);
    }
    return session;
  }

  global.MFR_APP = {
    init: init,
    logout: logout,
    getSession: getSession,
    svg: svg,
    escapeHtml: escapeHtml
  };
})(window);
