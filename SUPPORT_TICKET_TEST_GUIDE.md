# Support Ticket System - Manual Testing Guide

## ✅ System Status Check

### Services Running
- ✅ **Backend Server**: `http://localhost:5174` (port 5174)
- ✅ **Lab Portal**: `http://localhost:3002/lab/` (port 3002)
- ✅ **API Endpoint**: `http://localhost:5174/api/support/tickets` ✓ Responding
- ✅ **Database**: `d:\herb2\server\support_tickets.json` ✓ Initialized

### Files Created
- ✅ `d:\herb2\server\support_uploads/` - Attachment storage
- ✅ `d:\herb2\server\support_tickets.json` - Ticket database
- ✅ `d:\herb2\src\labportal\src\lab\pages\Support\ReportIssue.tsx` - Report form
- ✅ `d:\herb2\src\labportal\src\lab\pages\Support\ViewTickets.tsx` - View tickets
- ✅ Routes added to `LabApp.tsx`

---

## 🧪 End-to-End Testing Steps

### Test 1: Report Issue Page - Basic Validation

**Steps:**
1. Open browser: `http://localhost:3002/lab/support/report`
2. Verify auto-filled fields:
   - ✅ Lab Technician Name should be filled
   - ✅ Lab ID should be filled (e.g., LAB001)
   - ✅ Date & Time should update every second
3. Leave all other fields empty and click "Submit Support Ticket"
4. **Expected**: Red error messages appear:
   - "Please select an issue type"
   - "Description is required"

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 2: Report Issue - Description Validation

**Steps:**
1. Select issue type: "Portal Error"
2. Select severity: "High"
3. Enter description: "Test" (only 4 characters)
4. Click "Submit Support Ticket"
5. **Expected**: Error message: "Description must be at least 20 characters"
6. Add more text to reach 20+ characters
7. **Expected**: Error disappears, character count turns green

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 3: Report Issue - Invalid File Upload

**Steps:**
1. Fill form with valid data:
   - Issue type: "Blockchain Sync Failure"
   - Severity: "High"
   - Description: "Unable to sync test results to blockchain ledger. This has been happening for 2 hours."
2. Try to upload invalid file (create test.txt):
   ```powershell
   echo "test" > test.txt
   ```
3. Click file upload area and select `test.txt`
4. **Expected**: Error message: "Only PNG, JPG, JPEG, and PDF files are allowed"

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 4: Report Issue - Successful Submission (No File)

**Steps:**
1. Fill form with valid data:
   - Issue type: "Data Entry Problem"
   - Severity: "Medium"
   - Description: "Unable to save test results for batch SURTN1201NE. The save button is not responding correctly."
2. Don't attach any file
3. Click "Submit Support Ticket"
4. **Expected**:
   - ✅ Submit button shows loading spinner
   - ✅ Green success toast appears in top-right
   - ✅ Toast shows: "Issue reported successfully. Ticket ID: SUPLAB-00001"
   - ✅ Form resets after 5 seconds
5. Verify ticket was created:
   ```powershell
   cat d:\herb2\server\support_tickets.json
   ```
6. **Expected**: JSON file contains 1 ticket with:
   - ticketId: "SUPLAB-00001"
   - status: "Pending"
   - description: Your entered text
   - attachment: null

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 5: Report Issue - File Upload Success

**Steps:**
1. Create a test image (or use any .png/.jpg on your system)
2. Fill form with valid data:
   - Issue type: "Test Result Update Issue"
   - Severity: "High"
   - Description: "Cannot update test results. Screenshot attached showing the error message encountered."
3. Upload the image file
4. **Expected**: File preview shows filename and size
5. Click "Submit Support Ticket"
6. **Expected**:
   - ✅ Success toast with ticket ID: "SUPLAB-00002"
7. Verify file was saved:
   ```powershell
   ls d:\herb2\server\support_uploads\
   ```
8. **Expected**: File exists: `SUPLAB-00002.png` (or .jpg)

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 6: View Tickets Page - Display All Tickets

**Steps:**
1. Navigate to: `http://localhost:3002/lab/support/tickets`
2. **Expected**:
   - ✅ Page shows "2 of 2 tickets" (or however many you created)
   - ✅ Tickets displayed as cards
   - ✅ Each card shows:
     - Ticket ID (e.g., SUPLAB-00001)
     - Issue Type badge
     - Severity badge (color-coded: High=red, Medium=orange, Low=green)
     - Status badge (Pending=yellow)
     - First line of description
     - Date created

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 7: View Tickets - Search Functionality

**Steps:**
1. In search box, type: "blockchain"
2. **Expected**: Only tickets with "blockchain" in ID, type, or description show
3. Clear search
4. Type: "SUPLAB-00001"
5. **Expected**: Only ticket SUPLAB-00001 shows

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 8: View Tickets - Filter by Status

**Steps:**
1. Click status filter dropdown
2. Select "In Progress"
3. **Expected**: No tickets show (all are "Pending")
4. Message shows: "No tickets found matching your filters"
5. Select "Pending"
6. **Expected**: All tickets appear again

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 9: View Tickets - Filter by Severity

**Steps:**
1. Click severity filter dropdown
2. Select "Low"
3. **Expected**: No tickets (if none are Low severity)
4. Select "High"
5. **Expected**: Only High severity tickets show
6. Select "All"
7. **Expected**: All tickets appear

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 10: View Tickets - Expand Ticket Details

**Steps:**
1. Click on any ticket card
2. **Expected**: Card expands with smooth animation showing:
   - ✅ Full description (not truncated)
   - ✅ User Information section:
     - Lab Technician Name
     - Lab ID
     - Timestamp
   - ✅ Attachment section (if file was uploaded):
     - "View Attachment" link
   - ✅ Admin Notes section (if any - likely empty)
3. Click card again
4. **Expected**: Card collapses with smooth animation

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 11: View Tickets - Download Attachment

**Steps:**
1. Expand ticket SUPLAB-00002 (the one with attachment)
2. Click "View Attachment" link
3. **Expected**:
   - ✅ Opens in new tab
   - ✅ Image displays correctly
   - ✅ URL is: `http://localhost:5174/support_uploads/SUPLAB-00002.png`

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 12: API - Update Ticket Status (Admin Function)

**Steps:**
1. Open PowerShell
2. Run command:
   ```powershell
   $body = '{"status":"Resolved","adminNotes":"Issue fixed in latest update. Blockchain sync restored."}' 
   Invoke-WebRequest -Uri http://localhost:5174/api/support/tickets/SUPLAB-00001 -Method PUT -Body $body -ContentType "application/json"
   ```
3. **Expected**: Status code 200
4. Refresh View Tickets page
5. **Expected**:
   - ✅ SUPLAB-00001 status badge now shows "Resolved" (green)
   - ✅ Expand ticket and see admin notes: "Issue fixed in latest update..."
   - ✅ Shows "Updated at" timestamp

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 13: API - Get Tickets with Filters

**Steps:**
1. Test GET with labId filter:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5174/api/support/tickets?labId=LAB001" | Select-Object -ExpandProperty Content
   ```
2. **Expected**: JSON array with tickets for LAB001
3. Test with status filter:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5174/api/support/tickets?status=Pending" | Select-Object -ExpandProperty Content
   ```
4. **Expected**: Only pending tickets returned
5. Test with combined filters:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5174/api/support/tickets?labId=LAB001&severity=High" | Select-Object -ExpandProperty Content
   ```
6. **Expected**: Only High severity tickets for LAB001

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 14: Responsive Design - Mobile View

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12" or similar mobile device
4. Navigate to Report Issue page
5. **Expected**:
   - ✅ Form fields stack vertically
   - ✅ All content readable without horizontal scroll
   - ✅ Buttons are touch-friendly size
6. Navigate to View Tickets page
7. **Expected**:
   - ✅ Tickets display in single column
   - ✅ Search and filters stack vertically
   - ✅ No layout breaks

**Result**: ⬜ Pass / ⬜ Fail

---

### Test 15: Edge Cases

**Test 15a: Large File Upload (> 5MB)**
1. Create or find file > 5MB
2. Try to upload
3. **Expected**: Error: "File size must be less than 5MB"
4. **Result**: ⬜ Pass / ⬜ Fail

**Test 15b: Very Long Description**
1. Enter 1000+ character description
2. Submit
3. **Expected**: Submission succeeds, character count shows correctly
4. **Result**: ⬜ Pass / ⬜ Fail

**Test 15c: Special Characters in Description**
1. Enter description with special chars: `<script>alert('test')</script>`
2. Submit and view ticket
3. **Expected**: Text displayed as-is, no script execution (XSS protection)
4. **Result**: ⬜ Pass / ⬜ Fail

**Test 15d: Concurrent Ticket Creation**
1. Open two browser tabs
2. Submit tickets from both tabs simultaneously
3. **Expected**: Both tickets created with unique sequential IDs
4. **Result**: ⬜ Pass / ⬜ Fail

---

## 🎯 Quick API Tests (PowerShell)

### Create Test Ticket
```powershell
$boundary = [System.Guid]::NewGuid().ToString()
$LF = "`r`n"

$bodyLines = (
    "--$boundary",
    "Content-Disposition: form-data; name=`"userName`"$LF",
    "Dr. PowerShell Test$LF",
    "--$boundary",
    "Content-Disposition: form-data; name=`"labId`"$LF",
    "LAB001$LF",
    "--$boundary",
    "Content-Disposition: form-data; name=`"issueType`"$LF",
    "Portal Error$LF",
    "--$boundary",
    "Content-Disposition: form-data; name=`"severity`"$LF",
    "Medium$LF",
    "--$boundary",
    "Content-Disposition: form-data; name=`"description`"$LF",
    "This is a test ticket created via PowerShell to verify API functionality.$LF",
    "--$boundary--$LF"
) -join ''

Invoke-WebRequest -Uri http://localhost:5174/api/support/tickets -Method POST -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines
```

### Get All Tickets
```powershell
Invoke-WebRequest -Uri http://localhost:5174/api/support/tickets | Select-Object -ExpandProperty Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

### Update Ticket
```powershell
$updateBody = @{
    status = "In Progress"
    adminNotes = "Team is investigating the issue"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5174/api/support/tickets/SUPLAB-00001 -Method PUT -Body $updateBody -ContentType "application/json"
```

---

## 📊 Test Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Basic Validation | ⬜ | |
| 2 | Description Validation | ⬜ | |
| 3 | Invalid File Upload | ⬜ | |
| 4 | Successful Submission (No File) | ⬜ | |
| 5 | File Upload Success | ⬜ | |
| 6 | Display All Tickets | ⬜ | |
| 7 | Search Functionality | ⬜ | |
| 8 | Filter by Status | ⬜ | |
| 9 | Filter by Severity | ⬜ | |
| 10 | Expand Ticket Details | ⬜ | |
| 11 | Download Attachment | ⬜ | |
| 12 | Update Ticket (API) | ⬜ | |
| 13 | API Filters | ⬜ | |
| 14 | Responsive Design | ⬜ | |
| 15 | Edge Cases | ⬜ | |

---

## 🐛 Known Issues / Notes
- None yet

---

## ✨ Feature Enhancements (Future)
- [ ] Email notifications on ticket creation
- [ ] Admin dashboard for ticket management
- [ ] Ticket comments/replies
- [ ] File preview (image thumbnails, PDF viewer)
- [ ] Ticket assignment to support staff
- [ ] SLA tracking (response time, resolution time)
- [ ] Export tickets to CSV/PDF
- [ ] Ticket priority levels
- [ ] Bulk operations (close multiple tickets)
- [ ] Real-time updates (WebSocket)

---

## 📞 Support
If any tests fail, check:
1. Both servers running (backend on 5174, frontend on 3002)
2. Browser console for errors (F12)
3. Server logs for API errors
4. Network tab in DevTools for failed requests
5. `support_tickets.json` for data integrity
