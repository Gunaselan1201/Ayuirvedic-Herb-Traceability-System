/* ==========================================================================
   Farmer Portal - Mock Data
   Static equivalent of src/farmerportal/src/data/mock.ts + blockchain ledger
   responses that the React app fetched from http://localhost:3001 in dev.
   ========================================================================== */

// Logged-in farmer profile (used as fallback / defaults across pages)
const FARMER_PROFILE = {
  farmerId: 'F-00123',
  farmerName: 'Ravi Kumar',
  mobile: '+91 98765 43210',
  address: 'Mohanur, Namakkal'
};

// ---------------------------------------------------------------------------
// Dashboard summary stats (NewDashboard.jsx stat cards)
// ---------------------------------------------------------------------------
const DASHBOARD_STATS = {
  sentForTesting: 3,
  approvedByLab: 4,
  sentToManufacturing: 3,
  rejectedFailed: 3,
  totalBatches: 13,
  successRate: 77,
  pendingTests: 3
};

// ---------------------------------------------------------------------------
// Sent for Testing (batches submitted by farmer, awaiting lab pickup)
// ---------------------------------------------------------------------------
const SENT_FOR_TESTING = [
  {
    id: 'SURTN1201NE', productName: 'Neem', dateSent: '01/12/2025', quantity: '250 kg',
    location: 'Mohanur, Namakkal', harvestDate: '2025-11-28'
  },
  {
    id: 'RAVTN0812TU', productName: 'Tulsi (Holy Basil)', dateSent: '08/12/2025', quantity: '180 kg',
    location: 'Mohanur, Namakkal', harvestDate: '2025-12-05'
  },
  {
    id: 'RAVTN1512AS', productName: 'Ashwagandha', dateSent: '15/12/2025', quantity: '320 kg',
    location: 'Mohanur, Namakkal', harvestDate: '2025-12-10'
  }
];

// ---------------------------------------------------------------------------
// Approved by Lab
// ---------------------------------------------------------------------------
const APPROVED_BY_LAB = [
  {
    id: 'RAVTN2011TU', productName: 'Tulsi (Holy Basil)', approvalDate: '22/11/2025', grade: 'A',
    quantity: '480 kg', testedBy: 'Quality Testing Lab, Chennai', testDate: '22/11/2025',
    approvalDecision: 'approve'
  },
  {
    id: 'RAVTN1511TU', productName: 'Turmeric', approvalDate: '18/11/2025', grade: 'A',
    quantity: '600 kg', testedBy: 'AgriLab Testing Center', testDate: '18/11/2025',
    approvalDecision: 'auto_approved'
  },
  {
    id: 'RAVTN0511AS', productName: 'Ashwagandha', approvalDate: '10/11/2025', grade: 'B',
    quantity: '350 kg', testedBy: 'Quality Testing Lab, Chennai', testDate: '10/11/2025',
    approvalDecision: 'approve'
  },
  {
    id: 'RAVTN2810NE', productName: 'Neem', approvalDate: '02/11/2025', grade: 'C',
    quantity: '210 kg', testedBy: 'AgriLab Testing Center', testDate: '02/11/2025',
    approvalDecision: 'approve'
  }
];

// ---------------------------------------------------------------------------
// Sent to Manufacturing
// ---------------------------------------------------------------------------
const SENT_TO_MANUFACTURING = [
  {
    id: 'RAVTN2011TU', productName: 'Tulsi (Holy Basil)', dateSent: '24/11/2025',
    manufacturer: 'Himalaya Wellness Company', quantity: '480 kg', grade: 'A'
  },
  {
    id: 'RAVTN1511TU', productName: 'Turmeric', dateSent: '20/11/2025',
    manufacturer: 'Dabur India Ltd', quantity: '600 kg', grade: 'A'
  },
  {
    id: 'RAVTN0511AS', productName: 'Ashwagandha', dateSent: '12/11/2025',
    manufacturer: 'Patanjali Ayurved', quantity: '350 kg', grade: 'B'
  }
];

// ---------------------------------------------------------------------------
// Rejected / Failed batches
// ---------------------------------------------------------------------------
const REJECTED_FAILED = [
  {
    id: 'RAVTN2210TU', productName: 'Turmeric', rejectedDate: '22/10/2025',
    reason: 'Moisture content exceeds acceptable limits', rejectedBy: 'Lab QC',
    type: 'Rejected', grade: 'B'
  },
  {
    id: 'RAVTN1010NE', productName: 'Neem', rejectedDate: '10/10/2025',
    reason: 'Pesticide residue exceeds acceptable limits (>0.1 ppm)', rejectedBy: 'AgriLab Testing Center',
    type: 'Failed', grade: 'F'
  },
  {
    id: 'RAVTN0110AS', productName: 'Ashwagandha', rejectedDate: '01/10/2025',
    reason: 'Aflatoxin levels exceed safety limits (>5 ppb)', rejectedBy: 'Quality Testing Lab, Chennai',
    type: 'Failed', grade: 'F'
  }
];

// ---------------------------------------------------------------------------
// Active Orders (farmer + lab stage batches, still moving through the chain)
// ---------------------------------------------------------------------------
const ACTIVE_ORDERS = [
  { id: 'RAVTN0201WH', productName: 'Wheat', quantity: '5 Ton', manufacturer: 'N/A', orderDate: '2025-09-02', status: 'Pending' },
  { id: 'RAVTN2812TU', productName: 'Tulsi (Holy Basil)', quantity: '150 kg', manufacturer: 'N/A', orderDate: '2025-12-28', status: 'Pending' },
  { id: 'RAVTN1512AS', productName: 'Ashwagandha', quantity: '320 kg', manufacturer: 'Himalaya Wellness', orderDate: '2025-12-15', status: 'In Process' }
];

// ---------------------------------------------------------------------------
// Order History (all farmer submissions, most recent first)
// ---------------------------------------------------------------------------
const LAST_ORDERS = [
  { id: 'RAVTN1512AS', productName: 'Ashwagandha', quantity: '320', unit: 'kg', dateTime: '2025-12-15T16:31:00' },
  { id: 'RAVTN0812TU', productName: 'Tulsi (Holy Basil)', quantity: '180', unit: 'kg', dateTime: '2025-12-08T11:05:00' },
  { id: 'SURTN1201NE', productName: 'Neem', quantity: '250', unit: 'kg', dateTime: '2025-12-01T09:20:00' },
  { id: 'RAVTN2011TU', productName: 'Tulsi (Holy Basil)', quantity: '480', unit: 'kg', dateTime: '2025-11-20T14:12:00' },
  { id: 'RAVTN1511TU', productName: 'Turmeric', quantity: '600', unit: 'kg', dateTime: '2025-11-15T10:45:00' },
  { id: 'RAVTN0511AS', productName: 'Ashwagandha', quantity: '350', unit: 'kg', dateTime: '2025-11-05T08:30:00' }
];

// ---------------------------------------------------------------------------
// Rejected Orders (lab stage batches graded F / Rejected)
// ---------------------------------------------------------------------------
const REJECTED_ORDERS = [
  { id: 'RAVTN1010NE', productName: 'Neem', quantity: '210 kg', manufacturer: 'N/A', rejectedOn: '2025-10-10', reason: 'Poor Quality' },
  { id: 'RAVTN0110AS', productName: 'Ashwagandha', quantity: '275 kg', manufacturer: 'N/A', rejectedOn: '2025-10-01', reason: 'Quantity Mismatch' }
];

// ---------------------------------------------------------------------------
// Notifications (bell dropdown)
// ---------------------------------------------------------------------------
const NOTIFICATIONS = [
  {
    id: 'N1', type: 'BATCH_APPROVED', status: 'approved', isRead: false,
    title: 'Batch Approved by Lab', message: 'Your batch RAVTN2011TU (Tulsi) was graded A and approved by the lab.',
    batchId: 'RAVTN2011TU', productName: 'Tulsi (Holy Basil)', quantity: 480, unit: 'kg', qualityGrade: 'A',
    timestamp: '2025-09-02T09:15:00'
  },
  {
    id: 'N2', type: 'SENT_TO_MANUFACTURING', status: 'info', isRead: false,
    title: 'Batch Sent to Manufacturing', message: 'Batch RAVTN1511TU (Turmeric) has been forwarded to Dabur India Ltd.',
    batchId: 'RAVTN1511TU', productName: 'Turmeric', quantity: 600, unit: 'kg', manufacturerName: 'Dabur India Ltd',
    timestamp: '2025-09-01T17:40:00'
  },
  {
    id: 'N3', type: 'BATCH_REJECTED', status: 'rejected', isRead: true,
    title: 'Batch Rejected', message: 'Batch RAVTN1010NE (Neem) failed lab testing due to pesticide residue levels.',
    batchId: 'RAVTN1010NE', productName: 'Neem', quantity: 210, unit: 'kg', qualityGrade: 'F',
    reason: 'Pesticide residue exceeds acceptable limits (>0.1 ppm)',
    timestamp: '2025-08-30T12:05:00'
  },
  {
    id: 'N4', type: 'BATCH_APPROVED', status: 'approved', isRead: true,
    title: 'Batch Approved by Lab', message: 'Your batch RAVTN0511AS (Ashwagandha) was graded B and approved by the lab.',
    batchId: 'RAVTN0511AS', productName: 'Ashwagandha', quantity: 350, unit: 'kg', qualityGrade: 'B',
    timestamp: '2025-08-28T10:00:00'
  }
];

// Product name -> 2-letter code used by the Batch ID generator (mirrors App.jsx logic)
function computeBatchId(farmerId, state, productName) {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const datePart = `${day}${month}`;
  const farmerPart = String(farmerId || 'FRM').substring(0, 3).toUpperCase();
  const stateMatch = /\(([^)]+)\)/.exec(state || '');
  const statePart = stateMatch ? stateMatch[1] : String(state || '').substring(0, 2).toUpperCase();
  const productPart = String(productName || '').substring(0, 2).toUpperCase();
  return `${farmerPart}${statePart}${datePart}${productPart}`;
}
