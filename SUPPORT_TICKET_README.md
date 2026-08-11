# Lab Portal Support Ticket System

## Overview
Production-ready support ticket system for the Lab Portal of the Blockchain-Based Ayurvedic Herb Traceability System. Allows lab technicians to report technical issues with structured, traceable tickets.

## Features
- ✅ **Report Issue Page**: Structured form with validation and file upload
- ✅ **View Tickets Page**: List, search, filter, and view all support tickets
- ✅ **Backend API**: Express.js server with REST endpoints
- ✅ **File Upload**: Support for screenshots (.png, .jpg, .jpeg, .pdf up to 5MB)
- ✅ **Authentication Integration**: Auto-fills lab ID and user name from session
- ✅ **Responsive Design**: Mobile and desktop friendly
- ✅ **Real-time Updates**: Dynamic ticket status and severity filtering

## Project Structure

```
herb2/
├── server/                          # Backend server
│   ├── index.js                     # Express server with API endpoints
│   ├── package.json                 # Server dependencies
│   ├── support_tickets.json         # Ticket database (JSON)
│   └── support_uploads/             # Uploaded attachments
│
└── src/labportal/src/lab/
    ├── LabApp.tsx                   # Main app with routing
    └── pages/Support/
        ├── ReportIssue.tsx          # Report issue form
        └── ViewTickets.tsx          # View all tickets
```

## Installation & Setup

### 1. Install Dependencies

**Backend Server:**
```bash
cd server
npm install
```

**Lab Portal Frontend:**
```bash
cd src/labportal
npm install
```

### 2. Start Services

**Start Backend Server (Port 5174):**
```bash
cd server
npm start

# For development with auto-reload:
npm run dev
```

**Start Lab Portal (Port 3003):**
```bash
cd src/labportal
npm run dev
```

**Start Main Backend (Port 3001) - if needed:**
```bash
cd backend
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5174/api
```

### Endpoints

#### 1. Create Support Ticket
```http
POST /api/support/tickets
Content-Type: multipart/form-data
```

**Parameters:**
- `userName` (string, required): Lab technician name
- `labId` (string, required): Lab ID
- `issueType` (string, required): One of: Portal Error, Data Entry Problem, Blockchain Sync Failure, Test Result Update Issue, Report Download Issue, Other
- `severity` (string, required): Low, Medium, or High
- `description` (string, required): Minimum 20 characters
- `timestamp` (string, optional): ISO 8601 timestamp
- `attachment` (file, optional): .png, .jpg, .jpeg, or .pdf (max 5MB)

**Response (201 Created):**
```json
{
  "ticketId": "SUPLAB-00001",
  "labId": "LAB45",
  "userName": "Dr. Rajesh Kumar",
  "issueType": "Blockchain Sync Failure",
  "description": "Unable to record test results for batch SURTN1201NE...",
  "severity": "High",
  "attachment": "/support_uploads/SUPLAB-00001.png",
  "status": "Pending",
  "timestamp": "2025-11-06T11:45:00Z",
  "createdAt": "2025-11-06T11:45:00Z"
}
```

#### 2. Get Support Tickets
```http
GET /api/support/tickets?labId=LAB45&status=Pending&severity=High
```

**Query Parameters (all optional):**
- `labId`: Filter by lab ID
- `status`: Filter by status (Pending, In Progress, Resolved, Closed)
- `severity`: Filter by severity (Low, Medium, High)

**Response (200 OK):**
```json
[
  {
    "ticketId": "SUPLAB-00001",
    "labId": "LAB45",
    "userName": "Dr. Rajesh Kumar",
    "issueType": "Blockchain Sync Failure",
    "description": "Unable to record test results...",
    "severity": "High",
    "attachment": "/support_uploads/SUPLAB-00001.png",
    "status": "Pending",
    "timestamp": "2025-11-06T11:45:00Z",
    "createdAt": "2025-11-06T11:45:00Z"
  }
]
```

#### 3. Get Single Ticket
```http
GET /api/support/tickets/:ticketId
```

**Response (200 OK):**
```json
{
  "ticketId": "SUPLAB-00001",
  "labId": "LAB45",
  ...
}
```

#### 4. Update Ticket (Admin)
```http
PUT /api/support/tickets/:ticketId
Content-Type: application/json
```

**Body:**
```json
{
  "status": "Resolved",
  "adminNotes": "Issue fixed in latest update"
}
```

**Response (200 OK):**
```json
{
  "ticketId": "SUPLAB-00001",
  "status": "Resolved",
  "adminNotes": "Issue fixed in latest update",
  "updatedAt": "2025-11-06T12:30:00Z",
  ...
}
```

## Testing with cURL

### Create Ticket (Without File)
```bash
curl -X POST http://localhost:5174/api/support/tickets \
  -F "userName=Dr. Rajesh Kumar" \
  -F "labId=LAB45" \
  -F "issueType=Blockchain Sync Failure" \
  -F "severity=High" \
  -F "description=Unable to record test results for batch SURTN1201NE. The blockchain sync has been failing for the past 2 hours." \
  -F "timestamp=2025-11-06T11:45:00Z"
```

### Create Ticket (With File)
```bash
curl -X POST http://localhost:5174/api/support/tickets \
  -F "userName=Dr. Rajesh Kumar" \
  -F "labId=LAB45" \
  -F "issueType=Portal Error" \
  -F "severity=Medium" \
  -F "description=Portal showing error message when trying to submit test results. Screenshot attached showing the exact error." \
  -F "attachment=@screenshot.png"
```

### Get All Tickets for Lab
```bash
curl "http://localhost:5174/api/support/tickets?labId=LAB45"
```

### Get Pending High-Priority Tickets
```bash
curl "http://localhost:5174/api/support/tickets?labId=LAB45&status=Pending&severity=High"
```

### Get Single Ticket
```bash
curl http://localhost:5174/api/support/tickets/SUPLAB-00001
```

### Update Ticket Status
```bash
curl -X PUT http://localhost:5174/api/support/tickets/SUPLAB-00001 \
  -H "Content-Type: application/json" \
  -d '{"status":"Resolved","adminNotes":"Issue fixed in version 2.1.0"}'
```

## Frontend Usage

### Report Issue Page
Navigate to: `http://localhost:3003/lab/support/report`

**Features:**
- Auto-filled lab technician name and lab ID from session
- Real-time date/time display
- Issue type dropdown with 6 categories
- Severity selection (Low, Medium, High) with color coding
- Description textarea with character count validation (min 20 chars)
- File upload with drag-and-drop support
- Client-side validation with inline error messages
- Success toast with ticket ID after submission
- Reset button to clear form

### View Tickets Page
Navigate to: `http://localhost:3003/lab/support/tickets`

**Features:**
- Search tickets by ID, issue type, or description
- Filter by status (All, Pending, In Progress, Resolved, Closed)
- Filter by severity (All, Low, Medium, High)
- Expandable ticket cards showing full details
- Attachment download links
- Color-coded status and severity badges
- Responsive grid layout
- Real-time results count

## Manual QA Checklist

### Report Issue Page
- [ ] Form loads with auto-filled lab name and lab ID
- [ ] Date/time updates every second
- [ ] Issue type dropdown shows all 6 options
- [ ] Can select severity (Low, Medium, High) - visual feedback
- [ ] Description validation - shows error for < 20 characters
- [ ] Description validation - accepts text >= 20 characters
- [ ] File upload - rejects invalid file types (.txt, .doc, etc.)
- [ ] File upload - rejects files > 5MB
- [ ] File upload - accepts valid files (.png, .jpg, .jpeg, .pdf)
- [ ] File upload - shows file name and size after selection
- [ ] File upload - can remove selected file
- [ ] Submit button disabled during submission
- [ ] Success toast appears with ticket ID after submission
- [ ] Form resets after successful submission
- [ ] Reset button clears all form fields
- [ ] "View Previous Reports" link navigates to tickets page

### View Tickets Page
- [ ] Page loads and fetches tickets for current lab ID
- [ ] Shows loading spinner while fetching
- [ ] Shows "No tickets found" if empty
- [ ] Search box filters tickets in real-time
- [ ] Status filter works correctly
- [ ] Severity filter works correctly
- [ ] Results count updates with filters
- [ ] Ticket cards show correct color-coded badges
- [ ] Click ticket card to expand/collapse details
- [ ] Expanded view shows full description
- [ ] Expanded view shows all ticket metadata
- [ ] Attachment link opens in new tab
- [ ] "Report New Issue" button navigates to report page
- [ ] Responsive layout works on mobile and desktop

### Backend API
- [ ] POST /api/support/tickets creates ticket successfully
- [ ] POST returns 400 for missing required fields
- [ ] POST returns 400 for invalid issue type
- [ ] POST returns 400 for invalid severity
- [ ] POST returns 400 for description < 20 chars
- [ ] POST returns 413 for file > 5MB
- [ ] POST returns 400 for invalid file type
- [ ] POST saves attachment to support_uploads/
- [ ] POST generates unique sequential ticket ID
- [ ] GET /api/support/tickets returns all tickets
- [ ] GET with labId filter returns only that lab's tickets
- [ ] GET with status filter works correctly
- [ ] GET with severity filter works correctly
- [ ] GET /api/support/tickets/:ticketId returns single ticket
- [ ] GET returns 404 for non-existent ticket ID
- [ ] PUT /api/support/tickets/:ticketId updates status
- [ ] PUT updates adminNotes correctly

### Security & Data Integrity
- [ ] Input sanitization prevents XSS
- [ ] File upload restricted to allowed types
- [ ] File size limit enforced
- [ ] Uploaded files saved with safe filenames
- [ ] support_tickets.json properly formatted
- [ ] Concurrent ticket creation doesn't cause issues
- [ ] No console errors in browser
- [ ] No unhandled promise rejections

## Theme Customization

The design matches the Lab Portal theme:
- **Background**: White (`bg-white`)
- **Accent Colors**: Blue-to-cyan gradient (`from-blue-600 to-cyan-600`)
- **Font**: Noto Sans
- **Icons**: Lucide React
- **Animations**: Framer Motion with smooth transitions

To customize colors, update the Tailwind classes in:
- `ReportIssue.tsx` - Form styling
- `ViewTickets.tsx` - Ticket list styling

## Troubleshooting

### Port Already in Use
If you see "Port 5174 is in use":
```bash
# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F

# Then restart
cd server
npm start
```

### File Upload Not Working
1. Check `support_uploads/` directory exists
2. Verify file permissions
3. Check server logs for multer errors
4. Confirm file size < 5MB and correct type

### Tickets Not Showing
1. Verify backend server is running (port 5174)
2. Check browser console for fetch errors
3. Verify `support_tickets.json` exists and is valid JSON
4. Check Network tab in DevTools for API response

### TypeScript Errors
```bash
cd src/labportal
npm install
```

## Production Deployment

### Before Deployment
1. Change API URL from `localhost:5174` to production URL
2. Set up environment variables for ports and URLs
3. Add authentication middleware to API endpoints
4. Set up database (MongoDB) instead of JSON file
5. Configure CORS for production domain
6. Set up file storage (AWS S3, Azure Blob, etc.)
7. Add rate limiting to prevent abuse
8. Set up logging and monitoring
9. Configure SSL/TLS for HTTPS
10. Add admin dashboard for ticket management

### Environment Variables
Create `.env` file:
```
PORT=5174
API_BASE_URL=http://localhost:5174
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./support_uploads
```

## License
MIT

## Support
For issues with this support ticket system, please contact the development team or create an issue in the project repository.
