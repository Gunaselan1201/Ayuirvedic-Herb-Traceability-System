const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5174;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/support_uploads', express.static(path.join(__dirname, 'support_uploads')));

// File storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'issues');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  }
});

// File filter - only accept specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
  
  if (allowedTypes.includes(ext) && allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPG, JPEG, and PDF files are allowed.'), false);
  }
};

// Multer configuration for issues
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Multer configuration for support tickets
const supportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'support_uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const ticketId = req.body.ticketId || `TEMP_${Date.now()}`;
    cb(null, `${ticketId}${ext}`);
  }
});

const uploadSupport = multer({
  storage: supportStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to generate issue ID
function generateIssueId() {
  const issuesPath = path.join(__dirname, 'issues.json');
  
  // Get current date in UTC
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Read existing issues
  let issues = [];
  if (fs.existsSync(issuesPath)) {
    const data = fs.readFileSync(issuesPath, 'utf8');
    issues = JSON.parse(data);
  }
  
  // Find issues from today and get next sequence number
  const todayIssues = issues.filter(issue => issue.issueId.includes(dateStr));
  const nextSeq = todayIssues.length + 1;
  const seqStr = String(nextSeq).padStart(3, '0');
  
  return `ISS${dateStr}-${seqStr}`;
}

// Helper function to safely append to issues.json
function appendIssue(newIssue) {
  const issuesPath = path.join(__dirname, 'issues.json');
  
  // Read existing issues
  let issues = [];
  if (fs.existsSync(issuesPath)) {
    const data = fs.readFileSync(issuesPath, 'utf8');
    issues = JSON.parse(data);
  }
  
  // Append new issue
  issues.push(newIssue);
  
  // Write back to file
  fs.writeFileSync(issuesPath, JSON.stringify(issues, null, 2), 'utf8');
  
  return newIssue;
}

// Sanitize input to prevent injection
function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
}

// POST /api/issues - Create new issue
app.post('/api/issues', upload.single('attachment'), (req, res) => {
  try {
    const { category, batchId, issueTitle, description, addedBy } = req.body;
    
    // Validation
    const allowedCategories = [
      'QR Code Problem',
      'Portal Bug',
      'Data Missing',
      'Lab Testing Issue',
      'Manufacturing Issue',
      'Other'
    ];
    
    if (!category || !allowedCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid or missing category',
        allowedCategories 
      });
    }
    
    if (!issueTitle || issueTitle.trim().length === 0) {
      return res.status(400).json({ error: 'Issue title is required' });
    }
    
    if (issueTitle.length > 120) {
      return res.status(400).json({ error: 'Issue title must be 120 characters or less' });
    }
    
    if (!description || description.trim().length < 30) {
      return res.status(400).json({ error: 'Description must be at least 30 characters' });
    }
    
    // Generate issue ID
    const issueId = generateIssueId();
    
    // Handle file upload
    let filePath = '';
    if (req.file) {
      filePath = `/uploads/issues/${req.file.filename}`;
    }
    
    // Create issue object
    const issue = {
      issueId,
      category: sanitizeInput(category),
      batchId: sanitizeInput(batchId) || '',
      issueTitle: sanitizeInput(issueTitle),
      description: sanitizeInput(description),
      filePath,
      addedBy: sanitizeInput(addedBy) || 'Unknown',
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    
    // Save to issues.json
    const savedIssue = appendIssue(issue);
    
    // Return success response
    res.status(201).json(savedIssue);
    
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /api/issues - Get all issues
app.get('/api/issues', (req, res) => {
  try {
    const issuesPath = path.join(__dirname, 'issues.json');
    
    if (!fs.existsSync(issuesPath)) {
      return res.json([]);
    }
    
    const data = fs.readFileSync(issuesPath, 'utf8');
    const issues = JSON.parse(data);
    
    res.json(issues);
    
  } catch (error) {
    console.error('Error reading issues:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /api/issues/:issueId - Get single issue
app.get('/api/issues/:issueId', (req, res) => {
  try {
    const { issueId } = req.params;
    const issuesPath = path.join(__dirname, 'issues.json');
    
    if (!fs.existsSync(issuesPath)) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    const data = fs.readFileSync(issuesPath, 'utf8');
    const issues = JSON.parse(data);
    
    const issue = issues.find(i => i.issueId === issueId);
    
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    res.json(issue);
    
  } catch (error) {
    console.error('Error reading issue:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// ============= SUPPORT TICKET ENDPOINTS =============

// Helper function to generate support ticket ID
function generateTicketId() {
  const ticketsPath = path.join(__dirname, 'support_tickets.json');
  
  let tickets = [];
  if (fs.existsSync(ticketsPath)) {
    const data = fs.readFileSync(ticketsPath, 'utf8');
    tickets = JSON.parse(data);
  }
  
  const nextNum = tickets.length + 1;
  return `SUPLAB-${String(nextNum).padStart(5, '0')}`;
}

// Helper function to safely append to support_tickets.json
function appendTicket(newTicket) {
  const ticketsPath = path.join(__dirname, 'support_tickets.json');
  
  let tickets = [];
  if (fs.existsSync(ticketsPath)) {
    const data = fs.readFileSync(ticketsPath, 'utf8');
    tickets = JSON.parse(data);
  }
  
  tickets.push(newTicket);
  fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2), 'utf8');
  
  return newTicket;
}

// POST /api/support/tickets - Create new support ticket
app.post('/api/support/tickets', uploadSupport.single('attachment'), (req, res) => {
  try {
    const { userName, labId, issueType, severity, description, timestamp } = req.body;
    
    // Validation
    const allowedIssueTypes = [
      'Portal Error',
      'Data Entry Problem',
      'Blockchain Sync Failure',
      'Test Result Update Issue',
      'Report Download Issue',
      'Other'
    ];
    
    const allowedSeverities = ['Low', 'Medium', 'High'];
    
    if (!issueType || !allowedIssueTypes.includes(issueType)) {
      return res.status(400).json({ 
        error: 'Invalid or missing issue type',
        allowedTypes: allowedIssueTypes 
      });
    }
    
    if (!severity || !allowedSeverities.includes(severity)) {
      return res.status(400).json({ 
        error: 'Invalid or missing severity',
        allowedSeverities 
      });
    }
    
    if (!description || description.trim().length < 20) {
      return res.status(400).json({ error: 'Description must be at least 20 characters' });
    }
    
    if (!userName || userName.trim().length === 0) {
      return res.status(400).json({ error: 'User name is required' });
    }
    
    if (!labId || labId.trim().length === 0) {
      return res.status(400).json({ error: 'Lab ID is required' });
    }
    
    // Generate ticket ID
    const ticketId = generateTicketId();
    
    // Handle file upload
    let attachment = null;
    if (req.file) {
      attachment = `/support_uploads/${req.file.filename}`;
    }
    
    // Create ticket object
    const ticket = {
      ticketId,
      labId: sanitizeInput(labId),
      userName: sanitizeInput(userName),
      issueType: sanitizeInput(issueType),
      description: sanitizeInput(description),
      severity: sanitizeInput(severity),
      attachment,
      status: 'Pending',
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Save to support_tickets.json
    const savedTicket = appendTicket(ticket);
    
    console.log(`Support ticket created: ${ticketId} for Lab ${labId}`);
    
    // Return success response
    res.status(201).json(savedTicket);
    
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /api/support/tickets - Get support tickets (optionally filter by labId)
app.get('/api/support/tickets', (req, res) => {
  try {
    const { labId, status, severity } = req.query;
    const ticketsPath = path.join(__dirname, 'support_tickets.json');
    
    if (!fs.existsSync(ticketsPath)) {
      return res.json([]);
    }
    
    const data = fs.readFileSync(ticketsPath, 'utf8');
    let tickets = JSON.parse(data);
    
    // Filter by labId if provided
    if (labId) {
      tickets = tickets.filter(t => t.labId === labId);
    }
    
    // Filter by status if provided
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }
    
    // Filter by severity if provided
    if (severity) {
      tickets = tickets.filter(t => t.severity === severity);
    }
    
    // Sort by most recent first
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(tickets);
    
  } catch (error) {
    console.error('Error reading support tickets:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /api/support/tickets/:ticketId - Get single support ticket
app.get('/api/support/tickets/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticketsPath = path.join(__dirname, 'support_tickets.json');
    
    if (!fs.existsSync(ticketsPath)) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const data = fs.readFileSync(ticketsPath, 'utf8');
    const tickets = JSON.parse(data);
    
    const ticket = tickets.find(t => t.ticketId === ticketId);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(ticket);
    
  } catch (error) {
    console.error('Error reading support ticket:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// PUT /api/support/tickets/:ticketId - Update support ticket (for admin)
app.put('/api/support/tickets/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, adminNotes } = req.body;
    const ticketsPath = path.join(__dirname, 'support_tickets.json');
    
    if (!fs.existsSync(ticketsPath)) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    const data = fs.readFileSync(ticketsPath, 'utf8');
    let tickets = JSON.parse(data);
    
    const ticketIndex = tickets.findIndex(t => t.ticketId === ticketId);
    
    if (ticketIndex === -1) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    // Update ticket
    if (status) {
      tickets[ticketIndex].status = status;
      tickets[ticketIndex].updatedAt = new Date().toISOString();
    }
    
    if (adminNotes) {
      tickets[ticketIndex].adminNotes = sanitizeInput(adminNotes);
    }
    
    // Save back to file
    fs.writeFileSync(ticketsPath, JSON.stringify(tickets, null, 2), 'utf8');
    
    console.log(`Support ticket updated: ${ticketId} - Status: ${status}`);
    
    res.json(tickets[ticketIndex]);
    
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// ============= END SUPPORT TICKET ENDPOINTS =============

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
});

// Start server
app.listen(PORT, () => {
  console.log(`Farmer Portal Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'uploads', 'issues')}`);
  console.log(`Issues database: ${path.join(__dirname, 'issues.json')}`);
});
