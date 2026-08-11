import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NOTIFICATIONS_FILE = path.join(__dirname, 'notifications.json');

// Notification types
export const NOTIFICATION_TYPES = {
  BATCH_RECEIVED: 'BATCH_RECEIVED',           // Lab receives new batch
  BATCH_APPROVED: 'BATCH_APPROVED',           // Farmer receives approval notification
  BATCH_REJECTED: 'BATCH_REJECTED',           // Farmer receives rejection notification
  SENT_TO_MANUFACTURING: 'SENT_TO_MANUFACTURING', // Both portals receive this
};

// Initialize notifications file if it doesn't exist
async function initNotificationsFile() {
  try {
    await fs.access(NOTIFICATIONS_FILE);
  } catch {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify([], null, 2));
  }
}

// Read all notifications
export async function getNotifications() {
  await initNotificationsFile();
  const data = await fs.readFile(NOTIFICATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Get notifications for a specific portal (farmer/lab)
export async function getNotificationsByPortal(portalType) {
  const notifications = await getNotifications();
  return notifications.filter(n => n.portalType === portalType);
}

// Get unread notifications for a portal
export async function getUnreadNotifications(portalType) {
  const notifications = await getNotifications();
  return notifications.filter(n => n.portalType === portalType && !n.isRead);
}

// Create a new notification
export async function createNotification(notificationData) {
  const notifications = await getNotifications();
  
  const newNotification = {
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    isRead: false,
    ...notificationData,
  };
  
  notifications.push(newNotification);
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
  
  return newNotification;
}

// Mark notification as read
export async function markAsRead(notificationId) {
  const notifications = await getNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.isRead = true;
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
    return notification;
  }
  
  return null;
}

// Mark multiple notifications as read
export async function markMultipleAsRead(notificationIds) {
  const notifications = await getNotifications();
  let updated = false;
  
  notificationIds.forEach(id => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      updated = true;
    }
  });
  
  if (updated) {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
  }
  
  return notifications.filter(n => notificationIds.includes(n.id));
}

// Delete old notifications (older than 30 days)
export async function cleanupOldNotifications() {
  const notifications = await getNotifications();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const filtered = notifications.filter(n => {
    const notifDate = new Date(n.timestamp);
    return notifDate > thirtyDaysAgo;
  });
  
  if (filtered.length !== notifications.length) {
    await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(filtered, null, 2));
  }
  
  return filtered.length;
}

// Helper functions for creating specific notification types

export async function notifyBatchReceived(batchId, productName, farmerName) {
  return await createNotification({
    type: NOTIFICATION_TYPES.BATCH_RECEIVED,
    portalType: 'lab',
    title: 'New Batch Received',
    message: `New batch ${batchId} (${productName}) received from ${farmerName} for testing.`,
    batchId,
    productName,
    farmerName,
    metadata: {
      action: 'test_batch',
    }
  });
}

export async function notifyBatchApproved(batchId, productName, farmerId, qualityGrade, quantity, unit) {
  return await createNotification({
    type: NOTIFICATION_TYPES.BATCH_APPROVED,
    portalType: 'farmer',
    title: 'Batch Approved ✓',
    message: `Your batch ${batchId} (${productName}) has been approved with grade ${qualityGrade}.`,
    batchId,
    productName,
    farmerId,
    qualityGrade,
    quantity,
    unit,
    status: 'approved',
    metadata: {
      action: 'view_details',
    }
  });
}

export async function notifyBatchRejected(batchId, productName, farmerId, reason, quantity, unit) {
  return await createNotification({
    type: NOTIFICATION_TYPES.BATCH_REJECTED,
    portalType: 'farmer',
    title: 'Batch Rejected ✗',
    message: `Your batch ${batchId} (${productName}) has been rejected. Reason: ${reason || 'Quality standards not met'}`,
    batchId,
    productName,
    farmerId,
    reason,
    quantity,
    unit,
    status: 'rejected',
    metadata: {
      action: 'view_details',
    }
  });
}

export async function notifySentToManufacturing(batchId, productName, farmerId, manufacturerName, qualityGrade, quantity, unit) {
  // Create notification for farmer
  const farmerNotification = await createNotification({
    type: NOTIFICATION_TYPES.SENT_TO_MANUFACTURING,
    portalType: 'farmer',
    title: 'Sent to Manufacturing',
    message: `Your batch ${batchId} (${productName}) has been sent to ${manufacturerName} for manufacturing.`,
    batchId,
    productName,
    farmerId,
    manufacturerName,
    qualityGrade,
    quantity,
    unit,
    metadata: {
      action: 'view_details',
    }
  });
  
  // Create notification for lab
  const labNotification = await createNotification({
    type: NOTIFICATION_TYPES.SENT_TO_MANUFACTURING,
    portalType: 'lab',
    title: 'Batch Forwarded to Manufacturing',
    message: `Batch ${batchId} (${productName}) has been successfully forwarded to ${manufacturerName}.`,
    batchId,
    productName,
    manufacturerName,
    qualityGrade,
    quantity,
    unit,
    metadata: {
      action: 'view_details',
    }
  });
  
  return { farmerNotification, labNotification };
}
