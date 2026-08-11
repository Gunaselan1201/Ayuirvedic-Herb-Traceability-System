# Report Issue Feature - Setup & Testing Guide

## 📋 Overview

Complete **Report Issue** feature for Farmer Portal with:
- ✅ Frontend: React + Tailwind + Framer Motion + Lucide icons
- ✅ Backend: Node.js + Express + Multer
- ✅ File uploads with validation
- ✅ JSON-based issue tracking
- ✅ Step-by-step form wizard (4 steps)

---

## 🚀 Quick Start

### 1. Start Backend Server

```powershell
cd d:\herb2\server
node index.js
```

**Expected output:**
```
✅ Farmer Portal Server running on http://localhost:5174
📁 Uploads directory: D:\herb2\server\uploads\issues
📋 Issues database: D:\herb2\server\issues.json
```

### 2. Start Frontend (in separate terminal)

```powershell
cd d:\herb2\src\farmerportal
npm run dev
```

**Expected output:**
```
VITE v4.5.14  ready in 548 ms
➜  Local:   http://localhost:5173/
```

### 3. Access Report Issue Feature

1. Open browser: `http://localhost:5173`
2. Login to Farmer Portal
3. Click on profile picture → **Report Issue** (in Settings section)

---

## 📂 Files Created

### Backend Files
```
d:\herb2\server\
├── index.js              # Express server with API endpoints
├── package.json          # Backend dependencies
├── issues.json           # Issue database (auto-created)
└── uploads\issues\       # File storage directory
```

### Frontend Files
```
d:\herb2\src\farmerportal\src\
└── pages\
    └── ReportIssue.jsx   # Main Report Issue page with 4-step wizard
```

### Modified Files
```
d:\herb2\src\farmerportal\src\
└── App.jsx               # Added ReportIssue routing and navigation
```

---

## 🎯 Feature Functionality

### 4-Step Form Wizard

**Step 1: Select Category**
- QR Code Problem
- Portal Bug
- Data Missing
- Lab Testing Issue
- Manufacturing Issue
- Other

**Step 2: Describe Issue**
- Issue Title (required, max 120 chars)
- Description (required, min 30 chars)
- Real-time character count
- Inline validation

**Step 3: Additional Info**
- Batch ID (optional)
- File Upload (optional)
  - Accepted: PNG, JPG, JPEG, PDF
  - Max size: 5MB
  - Client-side validation
  - Image preview for photos

**Step 4: Review & Submit**
- Review all entered data
- Confirmation before submission
- Submit button with loading state

### Success Response
After successful submission:
```
✅ Issue reported successfully. Ticket ID: ISS20251103-001
```

---

## 🔌 API Endpoints

### 1. POST /api/issues
**Create new issue**

**Request:**
```bash
POST http://localhost:5174/api/issues
Content-Type: multipart/form-data

Fields:
- category (required)
- batchId (optional)
- issueTitle (required, max 120 chars)
- description (required, min 30 chars)
- addedBy (required)
- attachment (optional file)
```

**Response (201):**
```json
{
  "issueId": "ISS20251103-001",
  "category": "QR Code Problem",
  "batchId": "SURTN1201NE",
  "issueTitle": "QR not scanning properly",
  "description": "When scanning the QR, it shows blank page instead of product info.",
  "filePath": "/uploads/issues/1730678400000_qr_issue.png",
  "addedBy": "Ravi Kumar",
  "timestamp": "2025-11-03T16:30:00.000Z",
  "status": "Pending"
}
```

**Error Responses:**
- `400` - Validation error
- `413` - File too large (>5MB)
- `500` - Server error

### 2. GET /api/issues
**Get all issues**

**Request:**
```bash
GET http://localhost:5174/api/issues
```

**Response (200):**
```json
[
  {
    "issueId": "ISS20251103-001",
    "category": "QR Code Problem",
    ...
  },
  ...
]
```

### 3. GET /api/issues/:issueId
**Get single issue**

**Request:**
```bash
GET http://localhost:5174/api/issues/ISS20251103-001
```

**Response (200):**
```json
{
  "issueId": "ISS20251103-001",
  "category": "QR Code Problem",
  ...
}
```

---

## 🧪 Testing Guide

### Test 1: Submit without file
```powershell
curl -X POST http://localhost:5174/api/issues `
  -F "category=Portal Bug" `
  -F "issueTitle=Test Issue Title" `
  -F "description=This is a test description with more than thirty characters to meet the minimum requirement." `
  -F "addedBy=Test User"
```

### Test 2: Submit with batch ID
```powershell
curl -X POST http://localhost:5174/api/issues `
  -F "category=QR Code Problem" `
  -F "batchId=SURTN1201NE" `
  -F "issueTitle=QR Scanner Not Working" `
  -F "description=The QR code scanner is not responding when I try to scan the batch QR code on mobile device." `
  -F "addedBy=Ravi Kumar"
```

### Test 3: Submit with file attachment
```powershell
curl -X POST http://localhost:5174/api/issues `
  -F "category=Data Missing" `
  -F "issueTitle=Missing Product Information" `
  -F "description=Some product details are not visible in the dashboard after submitting the batch for testing." `
  -F "addedBy=Suresh" `
  -F "attachment=@C:\path\to\screenshot.png"
```

### Test 4: Get all issues
```powershell
curl http://localhost:5174/api/issues
```

### Test 5: Get specific issue
```powershell
curl http://localhost:5174/api/issues/ISS20251103-001
```

---

## ✅ QA Checklist

### Frontend Validation
- [ ] Category selection required
- [ ] Issue title required (max 120 chars)
- [ ] Description required (min 30 chars)
- [ ] File type validation (PNG, JPG, JPEG, PDF only)
- [ ] File size validation (max 5MB)
- [ ] Image preview for uploaded images
- [ ] Character counters working
- [ ] Step navigation working
- [ ] Form clears after successful submission

### Backend Validation
- [ ] Category validation (allowed list)
- [ ] Title length validation
- [ ] Description length validation (min 30 chars)
- [ ] File type validation
- [ ] File size validation (max 5MB)
- [ ] Issue ID generation (ISS + YYYYMMDD + sequential number)
- [ ] Safe file storage with unique names
- [ ] JSON append without data loss

### Error Handling
- [ ] 400 for invalid category
- [ ] 400 for missing required fields
- [ ] 400 for invalid file types
- [ ] 413 for files >5MB
- [ ] 500 for server errors
- [ ] Toast notifications for errors
- [ ] Loading states during submission

### UI/UX
- [ ] Mobile responsive layout
- [ ] Smooth step transitions (Framer Motion)
- [ ] Keyboard navigation works
- [ ] Success toast shows ticket ID
- [ ] Back button works from all steps
- [ ] Consistent styling with Farmer Portal theme
- [ ] No console errors

---

## 📁 Issue ID Format

**Format:** `ISS + YYYYMMDD + sequential number`

**Examples:**
- `ISS20251103-001` - First issue of Nov 3, 2025
- `ISS20251103-002` - Second issue of Nov 3, 2025
- `ISS20251104-001` - First issue of Nov 4, 2025

**Generation Logic:**
1. Get current UTC date (YYYYMMDD)
2. Read existing issues.json
3. Count issues from same date
4. Increment counter (001, 002, 003...)
5. Format as ISS{date}-{counter}

---

## 🔒 Security Features

### Input Sanitization
- Remove HTML tags (`<>`)
- Trim whitespace
- Validate string lengths

### File Upload Security
- MIME type validation
- File extension validation
- Size limit enforcement (5MB)
- Safe filename generation (timestamp prefix)
- Isolated storage directory

### API Security
- CORS enabled for frontend
- Error messages don't expose internals
- File paths relative to server root

---

## 🐛 Troubleshooting

### Issue: "Connection refused" when submitting
**Solution:** Ensure backend server is running on port 5174
```powershell
cd d:\herb2\server
node index.js
```

### Issue: File upload fails
**Solution:** Check file size (<5MB) and type (PNG/JPG/PDF only)

### Issue: Issues not saving
**Solution:** Check issues.json permissions and ensure server has write access

### Issue: Frontend not showing Report Issue
**Solution:** Hard refresh browser (Ctrl+Shift+R) to clear cache

### Issue: Port 5174 already in use
**Solution:** 
```powershell
# Find process using port 5174
Get-NetTCPConnection -LocalPort 5174
# Kill the process
Stop-Process -Id <PID> -Force
```

---

## 📊 Database Structure (issues.json)

```json
[
  {
    "issueId": "ISS20251103-001",
    "category": "QR Code Problem",
    "batchId": "SURTN1201NE",
    "issueTitle": "QR not scanning properly",
    "description": "When scanning the QR, it shows blank page instead of product info.",
    "filePath": "/uploads/issues/1730678400000_qr_issue.png",
    "addedBy": "Ravi Kumar",
    "timestamp": "2025-11-03T16:30:00.000Z",
    "status": "Pending"
  }
]
```

**Field Descriptions:**
- `issueId` - Unique identifier (auto-generated)
- `category` - Issue category (from predefined list)
- `batchId` - Optional batch reference
- `issueTitle` - Brief summary (max 120 chars)
- `description` - Detailed description (min 30 chars)
- `filePath` - Relative path to uploaded file (empty if none)
- `addedBy` - Farmer name (from session)
- `timestamp` - UTC ISO timestamp
- `status` - Current status (always "Pending" on creation)

---

## 🎨 UI Design Features

### Colors
- Primary: Green (#16a34a)
- Background: Gradient green-blue (#f0fdf4 to #eff6ff)
- Cards: White with shadow
- Text: Gray scale (#1f2937, #6b7280)

### Animations (Framer Motion)
- Step transitions: Slide and fade
- Button hover: Scale 1.02
- Toast: Slide from top
- Loading spinner: Rotate animation

### Icons (Lucide React)
- ArrowLeft, ArrowRight - Navigation
- CheckCircle2 - Success
- AlertCircle - Validation errors
- Upload - File upload
- FileText - Issue title
- MessageSquare - Description
- Package - Batch ID

### Typography
- Font: Noto Sans (inherited from Farmer Portal)
- Headers: Bold, 2xl-3xl
- Body: Regular, base
- Labels: Medium, sm

---

## 🚀 Production Deployment

### Environment Variables
Create `.env` file in `/server`:
```env
PORT=5174
NODE_ENV=production
UPLOAD_DIR=./uploads/issues
ISSUES_DB=./issues.json
MAX_FILE_SIZE=5242880
```

### Build Frontend
```powershell
cd d:\herb2\src\farmerportal
npm run build
```

### Start Backend (Production)
```powershell
cd d:\herb2\server
npm start
```

### Process Manager (Optional)
```powershell
npm install -g pm2
pm2 start index.js --name farmer-portal-server
pm2 save
pm2 startup
```

---

## 📝 Future Enhancements

1. **Admin Dashboard** - View and manage all issues
2. **Status Updates** - Allow admins to update issue status
3. **Email Notifications** - Send confirmation emails
4. **My Issues Page** - Farmers can view their submitted issues
5. **Comments/Replies** - Two-way communication
6. **Issue Categories Management** - Dynamic category list
7. **Analytics** - Issue trends and reports
8. **Search & Filter** - Find issues by category, status, date
9. **Priority Levels** - High, Medium, Low priority
10. **Database Migration** - Move from JSON to MongoDB/PostgreSQL

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review console logs (browser and server)
- Verify all dependencies installed
- Ensure both servers running simultaneously

---

## ✨ Success Criteria

Feature is working correctly when:
- ✅ Both frontend and backend servers start without errors
- ✅ Can navigate to Report Issue page from sidebar
- ✅ All 4 steps work smoothly with validation
- ✅ Files upload and preview correctly
- ✅ Success toast displays with ticket ID
- ✅ Issue saved to issues.json with all fields
- ✅ GET /api/issues returns all issues
- ✅ No console errors in browser or terminal

---

**Last Updated:** November 3, 2025
**Version:** 1.0.0
