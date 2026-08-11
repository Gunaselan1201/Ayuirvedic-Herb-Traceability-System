// server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import * as ledgerService from './ledgerService.js';
import * as notificationService from './backend/notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

const USERS_FILE = path.join(__dirname, 'users.json');
const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));

// Middleware
app.use(cors());
app.use(express.json());

// Auth
app.post('/auth/login', (req, res) => {
  const { userId, password, role } = req.body;
  if (!userId || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing userId, password, or role' });
  }

  const user = users.find(u => u.userId === userId && u.role === role);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { passwordHash, ...userData } = user;
  res.json({ success: true, user: userData });
});

// API Routes
app.post('/add-event', (req, res) => {
  const { batchId, stage, data, addedBy } = req.body;
  if (!batchId || !stage || !data || !addedBy) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const event = ledgerService.addEvent({ batchId, stage, data, addedBy });
  res.json({ success: true, event });
});

// New batch creation endpoint with auto-generated Batch ID
app.post('/batch', (req, res) => {
  const { batchId, farmerId, stage, timestamp, photos, ...formData } = req.body;
  
  if (!batchId || !stage || !farmerId) {
    return res.status(400).json({ error: 'Missing required fields: batchId, stage, farmerId' });
  }
  
  // Prepare the data object
  const data = {
    ...formData,
    photos: photos || [],
    timestamp: timestamp || new Date().toISOString()
  };
  
  // Add event to ledger
  const event = ledgerService.addEvent({
    batchId,
    stage,
    data,
    addedBy: farmerId
  });
  
  res.json({ 
    success: true, 
    batchId,
    event,
    message: `Batch ${batchId} created successfully` 
  });
});

app.get('/events', (req, res) => {
  res.json(ledgerService.getEvents());
});

app.get('/events/:batchId', (req, res) => {
  const { batchId } = req.params;
  res.json(ledgerService.getEventsByBatchId(batchId));
});

app.get('/tested-batches', (req, res) => {
  res.json(ledgerService.getTestedBatches());
});

// Notification endpoints
app.get('/notifications', async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

app.get('/notifications/:portalType', async (req, res) => {
  try {
    const { portalType } = req.params;
    const notifications = await notificationService.getNotificationsByPortal(portalType);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

app.get('/notifications/:portalType/unread', async (req, res) => {
  try {
    const { portalType } = req.params;
    const notifications = await notificationService.getUnreadNotifications(portalType);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread notifications', details: error.message });
  }
});

app.post('/notifications', async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification', details: error.message });
  }
});

app.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    if (notification) {
      res.json({ success: true, notification });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read', details: error.message });
  }
});

app.patch('/notifications/read-multiple', async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const notifications = await notificationService.markMultipleAsRead(notificationIds);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read', details: error.message });
  }
});

// Helper to serve React builds correctly
function servePortal(route, folder) {
  const distPath = path.join(__dirname, 'src', folder, 'dist');
  app.use(route, express.static(distPath));
  app.get(`${route}/*`, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Serve all portals
servePortal('/farmer', 'farmerportal');
servePortal('/lab', 'labportal');
servePortal('/manufacturer', 'manufportal');
servePortal('/consumer', 'consumerportal');

// Start server
app.listen(PORT, () => {
  console.log(`HERB Ledger Server running on http://localhost:${PORT}`);
  console.log(`Farmer Portal: http://localhost:${PORT}/farmer`);
  console.log(`Lab Portal: http://localhost:${PORT}/lab`);
  console.log(`Manufacturer Portal: http://localhost:${PORT}/manufacturer`);
  console.log(`Consumer Portal: http://localhost:${PORT}/consumer`);
});
