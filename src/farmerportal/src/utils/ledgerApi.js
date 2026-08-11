// Utility functions for fetching and filtering blockchain ledger data

const LEDGER_API_URL = 'http://localhost:3001';

/**
 * Fetch all events from the blockchain ledger
 */
export const fetchAllEvents = async () => {
  const resp = await fetch(`${LEDGER_API_URL}/events`);
  if (!resp.ok) throw new Error(`Failed to fetch events: ${resp.status}`);
  return await resp.json();
};

/**
 * Fetch events for a specific batch ID
 */
export const fetchBatchEvents = async (batchId) => {
  const resp = await fetch(`${LEDGER_API_URL}/events/${batchId}`);
  if (!resp.ok) throw new Error(`Failed to fetch batch ${batchId}: ${resp.status}`);
  return await resp.json();
};

/**
 * Filter ledger events for a specific farmer
 */
export const filterFarmerEvents = (events, farmerId) => {
  return events.filter(entry => {
    if (!entry) return false;
    const addedByMatch = String(entry.addedBy || '').trim() === String(farmerId).trim();
    const dataFarmerMatch = entry.data && String(entry.data.farmerId || '').trim() === String(farmerId).trim();
    return addedByMatch || dataFarmerMatch;
  });
};

/**
 * Get batches sent for testing (stage = farmer)
 */
export const getSentForTestingBatches = (events, farmerId) => {
  const farmerEvents = filterFarmerEvents(events, farmerId);
  return farmerEvents.filter(e => e.stage === 'farmer');
};

/**
 * Get batches approved by lab (stage = lab, grade A or B)
 */
export const getApprovedByLabBatches = (events, farmerId) => {
  const farmerEvents = filterFarmerEvents(events, farmerId);
  return farmerEvents.filter(e => 
    e.stage === 'lab' && (e.data.qualityGrade === 'A' || e.data.qualityGrade === 'B')
  );
};

/**
 * Get batches sent to manufacturing (stage = manufacturer)
 */
export const getSentToManufacturingBatches = (events, farmerId) => {
  const farmerEvents = filterFarmerEvents(events, farmerId);
  return farmerEvents.filter(e => e.stage === 'manufacturer');
};

/**
 * Get rejected/failed batches (stage = lab, grade F or Rejected)
 */
export const getRejectedFailedBatches = (events, farmerId) => {
  const farmerEvents = filterFarmerEvents(events, farmerId);
  return farmerEvents.filter(e => 
    e.stage === 'lab' && (e.data.qualityGrade === 'F' || e.data.qualityGrade === 'Rejected')
  );
};

/**
 * Calculate dashboard statistics
 */
export const calculateDashboardStats = (events, farmerId) => {
  const farmerEvents = filterFarmerEvents(events, farmerId);
  
  const sentForTesting = farmerEvents.filter(e => e.stage === 'farmer').length;
  const approvedByLab = farmerEvents.filter(e => 
    e.stage === 'lab' && (e.data.qualityGrade === 'A' || e.data.qualityGrade === 'B')
  ).length;
  const sentToManufacturing = farmerEvents.filter(e => e.stage === 'manufacturer').length;
  const rejectedFailed = farmerEvents.filter(e => 
    e.stage === 'lab' && (e.data.qualityGrade === 'F' || e.data.qualityGrade === 'Rejected')
  ).length;
  const totalBatches = farmerEvents.length;
  const successRate = totalBatches > 0 ? Math.round((approvedByLab / totalBatches) * 100) : 0;

  return {
    sentForTesting,
    approvedByLab,
    sentToManufacturing,
    rejectedFailed,
    totalBatches,
    successRate,
    pendingTests: sentForTesting
  };
};

/**
 * Transform batch data for display
 */
export const transformBatchForDisplay = (entry) => {
  return {
    id: entry.batchId,
    productName: entry.data.productName || 'Unknown',
    date: new Date(entry.timestamp).toLocaleDateString('en-GB'),
    timestamp: entry.timestamp,
    stage: entry.stage,
    addedBy: entry.addedBy,
    quantity: entry.data.quantity || 'N/A',
    location: entry.data.location || 'Unknown Location',
    grade: entry.data.qualityGrade || 'N/A',
    ...entry.data
  };
};
