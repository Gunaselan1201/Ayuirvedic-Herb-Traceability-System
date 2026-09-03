/* ==========================================================================
   Lab Portal - Mock Data
   Standalone static clone of src/labportal/src/lab (React) portal.
   All data below is hardcoded / mock - there is no real backend here.
   ========================================================================== */

// Demo lab session credentials (matches project README demo accounts)
const LAB_DEMO_CREDENTIALS = { labId: 'LAB001', password: 'pass456' };

// Mock batches - mirrors the shape of LabBatch objects built from ledger
// events in LabApp.tsx (id, productName, farmerName, collectionDate, status)
// status: PENDING | TESTED | REJECTED
const LAB_BATCHES = [
  {
    id: 'SURTN1201NE',
    productName: 'Ashwagandha Root',
    farmerName: 'Ramesh Kumar',
    collectionDate: '2026-08-28',
    status: 'PENDING',
    quantity: 50,
    unit: 'Kg'
  },
  {
    id: 'SURTN1188TU',
    productName: 'Turmeric Rhizome',
    farmerName: 'Suresh Patel',
    collectionDate: '2026-08-25',
    status: 'PENDING',
    quantity: 75,
    unit: 'Kg'
  },
  {
    id: 'SURTN1176NL',
    productName: 'Neem Leaves',
    farmerName: 'Lakshmi Devi',
    collectionDate: '2026-08-22',
    status: 'PENDING',
    quantity: 40,
    unit: 'Kg'
  },
  {
    id: 'SURTN1152TS',
    productName: 'Tulsi Leaves',
    farmerName: 'Anjali Sharma',
    collectionDate: '2026-08-15',
    status: 'TESTED',
    quantity: 30,
    unit: 'Kg',
    grade: 'A',
    testedDate: '2026-08-17',
    addedBy: 'LAB001',
    approvalStatus: 'approved',
    manufacturer: null
  },
  {
    id: 'SURTN1140BR',
    productName: 'Brahmi Whole Plant',
    farmerName: 'Ravi Verma',
    collectionDate: '2026-08-10',
    status: 'TESTED',
    quantity: 60,
    unit: 'Kg',
    grade: 'B',
    testedDate: '2026-08-12',
    addedBy: 'LAB001',
    approvalStatus: 'approved',
    manufacturer: null
  },
  {
    id: 'SURTN1129AM',
    productName: 'Amla Fruit',
    farmerName: 'Deepak Singh',
    collectionDate: '2026-08-05',
    status: 'TESTED',
    quantity: 90,
    unit: 'Kg',
    grade: 'C',
    testedDate: '2026-08-07',
    addedBy: 'LAB001',
    approvalStatus: 'conditionally_approved',
    manufacturer: null
  },
  {
    id: 'SURTN1108GG',
    productName: 'Giloy Stem',
    farmerName: 'Meena Kumari',
    collectionDate: '2026-07-30',
    status: 'TESTED',
    quantity: 45,
    unit: 'Kg',
    grade: 'A',
    testedDate: '2026-08-01',
    addedBy: 'LAB001',
    approvalStatus: 'approved',
    manufacturer: { id: 'MFG002', name: 'Himalaya Herbal Works', location: 'Dehradun, Uttarakhand', sentDate: '2026-08-03' }
  },
  {
    id: 'SURTN1095SH',
    productName: 'Shatavari Root',
    farmerName: 'Prakash Rao',
    collectionDate: '2026-07-25',
    status: 'TESTED',
    quantity: 55,
    unit: 'Kg',
    grade: 'B',
    testedDate: '2026-07-27',
    addedBy: 'LAB001',
    approvalStatus: 'approved',
    manufacturer: { id: 'MFG001', name: 'Kerala Ayurveda Ltd', location: 'Kochi, Kerala', sentDate: '2026-07-29' }
  },
  {
    id: 'SURTN1072PS',
    productName: 'Punarnava Whole Plant',
    farmerName: 'Kiran Bala',
    collectionDate: '2026-07-18',
    status: 'REJECTED',
    quantity: 35,
    unit: 'Kg',
    grade: 'F',
    testedDate: '2026-07-20',
    addedBy: 'LAB001',
    approvalStatus: 'rejected',
    rejectedBy: 'Lab QC',
    reason: 'Pesticide residue exceeded safe threshold (0.18 ppm > 0.1 ppm limit)',
    manufacturer: null
  },
  {
    id: 'SURTN1050VC',
    productName: 'Vacha Rhizome',
    farmerName: 'Manoj Tiwari',
    collectionDate: '2026-07-10',
    status: 'REJECTED',
    quantity: 25,
    unit: 'Kg',
    grade: 'F',
    testedDate: '2026-07-12',
    addedBy: 'LAB001',
    approvalStatus: 'rejected',
    rejectedBy: 'Lab QC',
    reason: 'Moisture content too high (14.2% > 12% limit), risk of fungal growth',
    manufacturer: null
  }
];

// Mock support tickets, used by view-tickets.html
const LAB_TICKETS = [
  {
    ticketId: 'TCK-20260828-001',
    labId: 'LAB001',
    userName: 'Lab Technician',
    issueType: 'Blockchain Sync Failure',
    description: 'The dashboard batch list did not refresh after submitting test results for batch SURTN1152TS. Had to manually reload the page to see the updated status.',
    severity: 'Medium',
    attachment: null,
    status: 'Resolved',
    timestamp: '2026-08-28T09:15:00Z',
    createdAt: '2026-08-28T09:15:00Z',
    adminNotes: 'Fixed in latest sync patch. Please clear cache if issue persists.'
  },
  {
    ticketId: 'TCK-20260820-004',
    labId: 'LAB001',
    userName: 'Lab Technician',
    issueType: 'PDF Generation Error',
    description: 'PDF report generation for batch SURTN1140BR was stuck on "Submitting..." for over a minute before finally completing.',
    severity: 'Low',
    attachment: null,
    status: 'In Progress',
    timestamp: '2026-08-20T14:32:00Z',
    createdAt: '2026-08-20T14:32:00Z'
  },
  {
    ticketId: 'TCK-20260812-002',
    labId: 'LAB001',
    userName: 'Lab Technician',
    issueType: 'Data Entry Problem',
    description: 'Quality grade auto-calculation did not update immediately after changing the pesticide residue value on the testing form.',
    severity: 'Medium',
    attachment: null,
    status: 'Pending',
    timestamp: '2026-08-12T11:05:00Z',
    createdAt: '2026-08-12T11:05:00Z'
  }
];

// Simple i18n strings used by the sidebar (mirrors translations.ts keys used
// in LabApp.tsx). Only English is provided; the language selector is a
// visual stub in this static build.
const LAB_TRANSLATIONS = {
  dashboard: 'Dashboard',
  testNewBatch: 'Test New Batch',
  batches: 'Batches',
  reportsAnalytics: 'Reports & Analytics',
  settings: 'Settings',
  helpSupport: 'Help & Support',
  logout: 'Logout',
  options: 'Options',
  accountInfo: 'Account Info',
  labId: 'Lab ID',
  role: 'Role',
  labTechnician: 'Lab Technician',
  lastLogin: 'Last Login',
  language: 'Language',
  reportIssue: 'Report Issue',
  pendingTests: 'Pending Tests',
  rejectedBatches: 'Rejected Batches'
};

function labT(key) {
  return LAB_TRANSLATIONS[key] || key;
}
