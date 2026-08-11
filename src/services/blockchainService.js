/**
 * Unified Blockchain Service
 * Handles all blockchain interactions across Farmer, Lab, and Manufacturer portals
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Get all blockchain events
 */
export async function getAllEvents() {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    console.error('Error fetching all events:', error);
    return [];
  }
}

/**
 * Get events for a specific batch
 */
export async function getBatchEvents(batchId) {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${batchId}`);
    if (!response.ok) throw new Error('Failed to fetch batch events');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching batch ${batchId}:`, error);
    return [];
  }
}

/**
 * Add a new event to the blockchain
 */
export async function addEvent(event) {
  try {
    const response = await fetch(`${API_BASE_URL}/add-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to add event');
    return await response.json();
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
}

/**
 * Create a new batch (Farmer Portal)
 */
export async function createBatch(batchData) {
  try {
    const response = await fetch(`${API_BASE_URL}/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchData)
    });
    if (!response.ok) throw new Error('Failed to create batch');
    return await response.json();
  } catch (error) {
    console.error('Error creating batch:', error);
    throw error;
  }
}

/**
 * Get batches for a specific farmer
 */
export async function getFarmerBatches(farmerId) {
  try {
    const allEvents = await getAllEvents();
    const farmerBatches = allEvents.filter(event => {
      const addedByMatch = String(event.addedBy || '').trim() === String(farmerId).trim();
      const dataFarmerMatch = event.data && String(event.data.farmerId || '').trim() === String(farmerId).trim();
      return addedByMatch || dataFarmerMatch;
    });
    
    // Group by batchId and get latest stage for each
    const batchMap = new Map();
    farmerBatches.forEach(event => {
      const existing = batchMap.get(event.batchId);
      if (!existing || new Date(event.timestamp) > new Date(existing.timestamp)) {
        if (!batchMap.has(event.batchId)) {
          batchMap.set(event.batchId, { ...event, stages: [] });
        }
        batchMap.get(event.batchId).stages.push(event.stage);
      }
    });
    
    return Array.from(batchMap.values());
  } catch (error) {
    console.error('Error getting farmer batches:', error);
    return [];
  }
}

/**
 * Get farmer dashboard statistics
 */
export async function getFarmerStats(farmerId) {
  try {
    const allEvents = await getAllEvents();
    
    // Step 1: Find all batchIds that belong to this farmer (from farmer-stage events)
    const farmerBatchIds = new Set();
    allEvents.forEach(event => {
      if (event.stage === 'farmer') {
        const addedByMatch = String(event.addedBy || '').trim() === String(farmerId).trim();
        const dataFarmerMatch = event.data && String(event.data.farmerId || '').trim() === String(farmerId).trim();
        if (addedByMatch || dataFarmerMatch) {
          farmerBatchIds.add(event.batchId);
        }
      }
    });

    // Step 2: For each farmer's batch, check ALL events to determine current stage
    const batchStages = new Map();
    allEvents.forEach(event => {
      if (farmerBatchIds.has(event.batchId)) {
        if (!batchStages.has(event.batchId)) {
          batchStages.set(event.batchId, new Set());
        }
        batchStages.get(event.batchId).add(event.stage);
      }
    });

    // Step 3: Count batches by their highest stage
    let sentForTesting = 0;
    let approvedByLab = 0;
    let sentToManufacturing = 0;
    let rejectedFailed = 0;

    for (const [batchId, stages] of batchStages.entries()) {
      if (stages.has('manufacturer')) {
        sentToManufacturing++;
      } else if (stages.has('lab')) {
        // Check if approved or rejected - look in ALL events for this batchId
        const labEvents = allEvents.filter(e => e.batchId === batchId && e.stage === 'lab');
        const latestLab = labEvents[labEvents.length - 1];
        if (latestLab && latestLab.data) {
          // Check new approvalStatus field first, then fallback to qualityGrade
          const approvalStatus = latestLab.data.approvalStatus;
          const grade = latestLab.data.qualityGrade || latestLab.data.quality;
          
          if (approvalStatus === 'rejected' || grade === 'F' || grade === 'Rejected') {
            rejectedFailed++;
          } else if (approvalStatus === 'approved' || approvalStatus === 'conditionally_approved' || grade === 'A' || grade === 'B' || grade === 'C') {
            approvedByLab++;
          }
        }
      } else if (stages.has('farmer')) {
        sentForTesting++;
      }
    }

    const totalBatches = batchStages.size;
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
  } catch (error) {
    console.error('Error getting farmer stats:', error);
    return {
      sentForTesting: 0,
      approvedByLab: 0,
      sentToManufacturing: 0,
      rejectedFailed: 0,
      totalBatches: 0,
      successRate: 0,
      pendingTests: 0
    };
  }
}

/**
 * Get lab dashboard statistics
 */
export async function getLabStats() {
  try {
    const allEvents = await getAllEvents();
    
    // Group by batchId
    const batchMap = new Map();
    allEvents.forEach(event => {
      if (!batchMap.has(event.batchId)) {
        batchMap.set(event.batchId, { farmer: null, lab: null, manufacturer: null });
      }
      const batch = batchMap.get(event.batchId);
      if (event.stage === 'farmer' && !batch.farmer) batch.farmer = event;
      if (event.stage === 'lab' && !batch.lab) batch.lab = event;
      if (event.stage === 'manufacturer' && !batch.manufacturer) batch.manufacturer = event;
    });

    let pending = 0;
    let tested = 0;
    let rejected = 0;
    let sentToManufacturing = 0;

    for (const [batchId, stages] of batchMap.entries()) {
      if (stages.manufacturer) {
        sentToManufacturing++;
      } else if (stages.lab) {
        const grade = stages.lab.data?.qualityGrade || stages.lab.data?.quality;
        if (grade === 'F' || grade === 'Rejected') {
          rejected++;
        } else {
          tested++;
        }
      } else if (stages.farmer) {
        pending++;
      }
    }

    return {
      pending,
      tested,
      rejected,
      sentToManufacturing,
      total: batchMap.size,
      successRate: batchMap.size > 0 ? Math.round((tested / batchMap.size) * 100) : 0
    };
  } catch (error) {
    console.error('Error getting lab stats:', error);
    return {
      pending: 0,
      tested: 0,
      rejected: 0,
      sentToManufacturing: 0,
      total: 0,
      successRate: 0
    };
  }
}

/**
 * Get manufacturer dashboard statistics
 */
export async function getManufacturerStats() {
  try {
    const allEvents = await getAllEvents();
    const manufacturerEvents = allEvents.filter(e => e.stage === 'manufacturer');
    
    return {
      totalReceived: manufacturerEvents.length,
      inProduction: manufacturerEvents.length,
      completed: 0,
      quality: {
        gradeA: 0,
        gradeB: 0,
        gradeC: 0
      }
    };
  } catch (error) {
    console.error('Error getting manufacturer stats:', error);
    return {
      totalReceived: 0,
      inProduction: 0,
      completed: 0,
      quality: { gradeA: 0, gradeB: 0, gradeC: 0 }
    };
  }
}

/**
 * Get batches by stage
 */
export async function getBatchesByStage(stage) {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter(event => event.stage === stage);
  } catch (error) {
    console.error(`Error getting ${stage} batches:`, error);
    return [];
  }
}

/**
 * Get pending batches for lab testing
 */
export async function getPendingLabBatches() {
  try {
    const allEvents = await getAllEvents();
    
    // Group by batchId
    const batchMap = new Map();
    allEvents.forEach(event => {
      if (!batchMap.has(event.batchId)) {
        batchMap.set(event.batchId, { stages: new Set(), latestFarmer: null, hasLab: false });
      }
      const batch = batchMap.get(event.batchId);
      batch.stages.add(event.stage);
      if (event.stage === 'farmer') batch.latestFarmer = event;
      if (event.stage === 'lab') batch.hasLab = true;
    });

    // Filter batches that have farmer stage but no lab stage
    const pendingBatches = [];
    for (const [batchId, info] of batchMap.entries()) {
      if (info.stages.has('farmer') && !info.hasLab && info.latestFarmer) {
        pendingBatches.push({
          id: batchId,
          productName: info.latestFarmer.data?.productName || 'Unknown',
          farmerName: info.latestFarmer.addedBy || 'Unknown',
          collectionDate: info.latestFarmer.data?.harvestedDate || info.latestFarmer.timestamp,
          status: 'PENDING',
          addedBy: info.latestFarmer.addedBy
        });
      }
    }

    return pendingBatches;
  } catch (error) {
    console.error('Error getting pending lab batches:', error);
    return [];
  }
}

/**
 * Get approved batches for manufacturer
 */
export async function getApprovedBatchesForManufacturer() {
  try {
    const allEvents = await getAllEvents();
    
    // Group by batchId
    const batchMap = new Map();
    allEvents.forEach(event => {
      if (!batchMap.has(event.batchId)) {
        batchMap.set(event.batchId, { lab: null, manufacturer: false });
      }
      const batch = batchMap.get(event.batchId);
      if (event.stage === 'lab') batch.lab = event;
      if (event.stage === 'manufacturer') batch.manufacturer = true;
    });

    // Filter approved batches not yet sent to manufacturer
    const approvedBatches = [];
    for (const [batchId, info] of batchMap.entries()) {
      if (info.lab && !info.manufacturer) {
        const grade = info.lab.data?.qualityGrade || info.lab.data?.quality;
        if (grade && grade !== 'F' && grade !== 'Rejected') {
          approvedBatches.push({
            id: batchId,
            productName: info.lab.data?.productName || 'Unknown',
            qualityGrade: grade,
            testedBy: info.lab.addedBy,
            testDate: info.lab.timestamp,
            status: 'APPROVED'
          });
        }
      }
    }

    return approvedBatches;
  } catch (error) {
    console.error('Error getting approved batches:', error);
    return [];
  }
}

export default {
  getAllEvents,
  getBatchEvents,
  addEvent,
  createBatch,
  getFarmerBatches,
  getFarmerStats,
  getLabStats,
  getManufacturerStats,
  getBatchesByStage,
  getPendingLabBatches,
  getApprovedBatchesForManufacturer
};
