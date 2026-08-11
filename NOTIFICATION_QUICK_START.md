# Notification System - Quick Start Guide

## Getting Started

### 1. Start the Backend Server
```powershell
cd d:\herb2
npm start
```
Server will run on `http://localhost:3001`

### 2. Start Farmer Portal
```powershell
cd d:\herb2\src\farmerportal
npm run dev
```
Portal will run on `http://localhost:5173`

### 3. Start Lab Portal
```powershell
cd d:\herb2\src\labportal
npm run dev
```
Portal will run on `http://localhost:3002`

---

## Testing the Notification Flow

### Test Scenario 1: Farmer Submits Batch Lab Receives Notification

1. **Open Farmer Portal** (`http://localhost:5173`)
2. Login with any credentials (auto-authenticated)
3. Click "Add Product" from sidebar
4. Fill out the batch form:
 - Product Name: Ashwagandha
 - Quantity: 100
 - Unit: kg
 - State: Tamil Nadu (TN)
 - Fill other required fields
5. Click "Submit"
6. **Switch to Lab Portal** (`http://localhost:3002`)
7. Click the menu icon () Notifications
8. **You should see**: "New Batch Received" notification with batch details
9. **Verify**:
 - Red badge shows unread count (e.g., "1")
 - Notification has blue left border
 - Click notification to see full details in modal

### Test Scenario 2: Login Notification Popup

1. **Clear browser cache** or open in incognito
2. **Submit a batch** from Farmer Portal (as in Test 1)
3. **Open Lab Portal** in new tab/window
4. Login (auto-authenticated)
5. **Wait 1 second**
6. **You should see**: Popup modal with unread notifications
7. **Verify**:
 - Modal appears automatically
 - Shows all unread notifications
 - Can click notification to see details
 - Close button dismisses popup

### Test Scenario 3: Auto-Refresh (Real-time Updates)

1. **Open both portals** side by side
2. **In Farmer Portal**: Submit a new batch
3. **Wait up to 30 seconds**
4. **In Lab Portal**: Notification should appear automatically (no refresh needed)
5. **Verify**: Unread badge count increases

### Test Scenario 4: Mark as Read

1. **In Lab Portal**: Click Notifications in sidebar
2. **See**: List of notifications with unread indicator (blue dot)
3. **Click** any notification
4. **Modal opens** with full details
5. **Close modal**
6. **Verify**:
 - Blue dot disappears
 - Notification no longer bold
 - Unread count decreases

---

## Verification Points

### Backend Verification
```powershell
# Check if notifications are being stored
cd d:\herb2\backend
type notifications.json
```
You should see JSON array with notification objects.

### API Testing
```powershell
# Get all notifications for lab
curl http://localhost:3001/notifications/lab

# Get unread notifications for farmer
curl http://localhost:3001/notifications/farmer/unread

# Get all notifications
curl http://localhost:3001/notifications
```

---

## Visual Indicators Guide

### Notification States
- **Unread**: Blue dot, bold text, thick border
- **Read**: No dot, normal text, thin border

### Color Coding
- **Blue Border**: Batch received (Lab Portal)
- **Green Border**: Batch approved (Farmer Portal)
- **Red Border**: Batch rejected (Farmer Portal)
- **Purple Border**: Sent to manufacturing (Both portals)

### Unread Badge
- Shows on "Notifications" menu item
- Red circular badge with white text
- Shows "9+" if more than 9 unread

---

## Common Issues

### Issue: No notifications appearing
**Solution**: 
1. Verify backend is running on port 3001
2. Check browser console for errors
3. Check `d:\herb2\backend\notifications.json` exists

### Issue: Unread count not updating
**Solution**:
1. Wait up to 30 seconds for auto-refresh
2. Manually refresh the page
3. Check browser console for fetch errors

### Issue: Login popup not showing
**Solution**:
1. Make sure you have unread notifications
2. Clear browser cache and try again
3. Check console for errors

### Issue: Notifications persist after marking as read
**Solution**:
1. Hard refresh the page (Ctrl+F5)
2. Check if PATCH request is successful in Network tab
3. Verify backend is responding

---

## Expected Notification Flow

```
Farmer Submits Batch
 
Backend Creates Notification (portalType: 'lab')
 
Lab Portal Auto-Fetches (within 30 seconds)
 
Notification Appears in Lab Sidebar
 
Lab User Clicks Notification
 
Modal Opens with Details
 
User Closes Modal
 
Notification Marked as Read
 
Unread Count Decreases
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get all notifications |
| GET | `/notifications/farmer` | Get farmer portal notifications |
| GET | `/notifications/lab` | Get lab portal notifications |
| GET | `/notifications/farmer/unread` | Get unread farmer notifications |
| GET | `/notifications/lab/unread` | Get unread lab notifications |
| POST | `/notifications` | Create new notification |
| PATCH | `/notifications/:id/read` | Mark single notification as read |
| PATCH | `/notifications/read-multiple` | Mark multiple notifications as read |

---

## Success Checklist

- [ ] Backend server starts without errors
- [ ] Farmer Portal loads successfully
- [ ] Lab Portal loads successfully
- [ ] Can submit batch from Farmer Portal
- [ ] Lab Portal receives notification
- [ ] Unread badge appears on notification icon
- [ ] Login popup shows unread notifications
- [ ] Can click notification to see modal
- [ ] Notification is marked as read when modal closes
- [ ] Auto-refresh works (new notifications appear within 30s)
- [ ] Notifications persist across page refreshes
- [ ] notifications.json file is created and populated

---

## Need Help?

1. Check the full implementation guide: `NOTIFICATION_SYSTEM_IMPLEMENTATION.md`
2. Review browser console for error messages
3. Check backend terminal for server errors
4. Verify all three services are running (backend, farmer portal, lab portal)

---

**Quick Start Complete!** 

You now have a fully functional cross-portal notification system with real-time updates, persistent storage, and interactive UI.
