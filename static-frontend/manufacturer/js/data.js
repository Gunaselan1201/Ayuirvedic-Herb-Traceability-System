/* ==========================================================================
   Manufacturer Portal - Mock Data
   Standalone replacement for the /events ledger API + /data/mock.ts catalog.
   Mirrors the batchId/stage/data shape used across ManufacturerApp.tsx pages.
   ========================================================================== */

(function (global) {
  'use strict';

  // ---- Mock ledger events -------------------------------------------------
  // Each batch can have a 'farmer' event, a 'lab' event, and (optionally) a
  // 'manufacturer' event, exactly like the real /events endpoint returns.
  var MOCK_EVENTS = [
    // 1) SURTN1201NE - Ashwagandha Root Powder - Grade A - Approved by lab only
    { batchId: 'SURTN1201NE', stage: 'farmer', timestamp: '2026-08-10T09:15:00Z',
      data: { productName: 'Ashwagandha Root Powder', farmerName: 'Ramesh Kumar', quantityValue: '250', quantityUnit: 'Kg' } },
    { batchId: 'SURTN1201NE', stage: 'lab', timestamp: '2026-08-14T11:30:00Z',
      data: { qualityGrade: 'A', labTechnicianName: 'Dr. Priya Sharma' } },

    // 2) TULAP0733GJ - Tulsi Leaf Extract - Grade B - Approved by lab only
    { batchId: 'TULAP0733GJ', stage: 'farmer', timestamp: '2026-08-05T08:00:00Z',
      data: { productName: 'Tulsi Leaf Extract', farmerName: 'Sita Devi', quantityValue: '180', quantityUnit: 'Kg' } },
    { batchId: 'TULAP0733GJ', stage: 'lab', timestamp: '2026-08-09T10:45:00Z',
      data: { qualityGrade: 'B', labTechnicianName: 'Dr. Arjun Mehta' } },

    // 3) NEEMH0456KA - Neem Leaf Powder - Grade C - Approved by lab only
    { batchId: 'NEEMH0456KA', stage: 'farmer', timestamp: '2026-07-28T07:20:00Z',
      data: { productName: 'Neem Leaf Powder', farmerName: 'Manoj Patil', quantityValue: '300', quantityUnit: 'Kg' } },
    { batchId: 'NEEMH0456KA', stage: 'lab', timestamp: '2026-08-02T13:10:00Z',
      data: { qualityGrade: 'C', labTechnicianName: 'Dr. Kavita Rao' } },

    // 4) BRAHKL0921TN - Brahmi Extract - Grade A - Approved by lab only
    { batchId: 'BRAHKL0921TN', stage: 'farmer', timestamp: '2026-08-20T09:50:00Z',
      data: { productName: 'Brahmi Extract', farmerName: 'Lakshmi Iyer', quantityValue: '120', quantityUnit: 'Kg' } },
    { batchId: 'BRAHKL0921TN', stage: 'lab', timestamp: '2026-08-24T15:05:00Z',
      data: { qualityGrade: 'A', labTechnicianName: 'Dr. Suresh Nair' } },

    // 5) ASHRJ0894RJ - Ashwagandha Capsules - Grade A - In Production
    { batchId: 'ASHRJ0894RJ', stage: 'farmer', timestamp: '2026-07-15T06:40:00Z',
      data: { productName: 'Ashwagandha Capsules', farmerName: 'Vikram Singh', quantityValue: '200', quantityUnit: 'Kg' } },
    { batchId: 'ASHRJ0894RJ', stage: 'lab', timestamp: '2026-07-19T12:00:00Z',
      data: { qualityGrade: 'A', labTechnicianName: 'Dr. Neha Gupta' } },
    { batchId: 'ASHRJ0894RJ', stage: 'manufacturer', timestamp: '2026-08-25T09:00:00Z',
      data: { status: 'In Production', manufacturerName: 'Himalaya Wellness', productType: 'Capsule' } },

    // 6) TRIMP0345MP - Triphala Churna - Grade B - Processing
    { batchId: 'TRIMP0345MP', stage: 'farmer', timestamp: '2026-07-22T07:10:00Z',
      data: { productName: 'Triphala Churna', farmerName: 'Anita Sharma', quantityValue: '275', quantityUnit: 'Kg' } },
    { batchId: 'TRIMP0345MP', stage: 'lab', timestamp: '2026-07-26T10:30:00Z',
      data: { qualityGrade: 'B', labTechnicianName: 'Dr. Rohit Verma' } },
    { batchId: 'TRIMP0345MP', stage: 'manufacturer', timestamp: '2026-08-28T14:20:00Z',
      data: { status: 'Processing', manufacturerName: 'Himalaya Wellness', productType: 'Powder' } },

    // 7) GILUP0678UP - Giloy Tablets - Grade A - Manufactured
    { batchId: 'GILUP0678UP', stage: 'farmer', timestamp: '2026-07-01T08:15:00Z',
      data: { productName: 'Giloy Tablets', farmerName: 'Rajesh Yadav', quantityValue: '220', quantityUnit: 'Kg' } },
    { batchId: 'GILUP0678UP', stage: 'lab', timestamp: '2026-07-05T09:45:00Z',
      data: { qualityGrade: 'A', labTechnicianName: 'Dr. Meera Joshi' } },
    { batchId: 'GILUP0678UP', stage: 'manufacturer', timestamp: '2026-07-20T11:00:00Z',
      data: { status: 'Manufactured', manufacturerName: 'Himalaya Wellness', productType: 'Capsule' } },

    // 8) AMLAKA0512KA - Amla Powder - Grade B - Ready
    { batchId: 'AMLAKA0512KA', stage: 'farmer', timestamp: '2026-06-25T07:30:00Z',
      data: { productName: 'Amla Powder', farmerName: 'Deepa Reddy', quantityValue: '310', quantityUnit: 'Kg' } },
    { batchId: 'AMLAKA0512KA', stage: 'lab', timestamp: '2026-06-29T09:00:00Z',
      data: { qualityGrade: 'B', labTechnicianName: 'Dr. Sanjay Kulkarni' } },
    { batchId: 'AMLAKA0512KA', stage: 'manufacturer', timestamp: '2026-07-15T10:15:00Z',
      data: { status: 'Ready', manufacturerName: 'Himalaya Wellness', productType: 'Powder' } },

    // 9) SHATB0789WB - Shatavari Capsules - Grade A - Completed
    { batchId: 'SHATB0789WB', stage: 'farmer', timestamp: '2026-06-18T06:50:00Z',
      data: { productName: 'Shatavari Capsules', farmerName: 'Bikram Das', quantityValue: '190', quantityUnit: 'Kg' } },
    { batchId: 'SHATB0789WB', stage: 'lab', timestamp: '2026-06-22T08:40:00Z',
      data: { qualityGrade: 'A', labTechnicianName: 'Dr. Ananya Chatterjee' } },
    { batchId: 'SHATB0789WB', stage: 'manufacturer', timestamp: '2026-07-10T13:30:00Z',
      data: { status: 'Completed', manufacturerName: 'Himalaya Wellness', productType: 'Capsule' } },

    // 10) HALDGJ0234GJ - Turmeric Extract Powder - Grade A - Dispatched
    { batchId: 'HALDGJ0234GJ', stage: 'farmer', timestamp: '2026-06-10T07:00:00Z',
      data: { productName: 'Turmeric Extract Powder', farmerName: 'Kiran Patel', quantityValue: '260', quantityUnit: 'Kg' } },
    { batchId: 'HALDGJ0234GJ', stage: 'lab', timestamp: '2026-06-14T09:20:00Z',
      data: { qualityGrade: 'A', labTechnicianName: 'Dr. Farhan Sheikh' } },
    { batchId: 'HALDGJ0234GJ', stage: 'manufacturer', timestamp: '2026-07-01T12:00:00Z',
      data: { status: 'Dispatched', manufacturerName: 'Himalaya Wellness', productType: 'Powder', destination: 'Mumbai Distribution Center' } },

    // 11) GUGGRJ0567RJ - Guggul Resin Extract - Grade B - Shipped
    { batchId: 'GUGGRJ0567RJ', stage: 'farmer', timestamp: '2026-06-05T08:10:00Z',
      data: { productName: 'Guggul Resin Extract', farmerName: 'Om Prakash', quantityValue: '150', quantityUnit: 'Kg' } },
    { batchId: 'GUGGRJ0567RJ', stage: 'lab', timestamp: '2026-06-09T10:00:00Z',
      data: { qualityGrade: 'B', labTechnicianName: 'Dr. Pooja Bansal' } },
    { batchId: 'GUGGRJ0567RJ', stage: 'manufacturer', timestamp: '2026-06-25T15:45:00Z',
      data: { status: 'Shipped', manufacturerName: 'Himalaya Wellness', productType: 'Oil', destination: 'Delhi Warehouse' } }
  ];

  // ---- Mock notifications (manufacturer notification feed) ---------------
  var MOCK_NOTIFICATIONS = [
    {
      id: 'N1001', type: 'BATCH_SENT_TO_MANUFACTURING', portalType: 'manufacturer',
      title: 'New Batch Sent to Manufacturing',
      message: 'Batch SURTN1201NE (Ashwagandha Root Powder) has been approved by the lab and is ready for production.',
      batchId: 'SURTN1201NE', productName: 'Ashwagandha Root Powder',
      timestamp: '2026-08-14T11:35:00Z', isRead: false,
      farmerName: 'Ramesh Kumar', farmerId: 'FRM-2201', grade: 'A', quantity: '250', unit: 'Kg'
    },
    {
      id: 'N1002', type: 'BATCH_APPROVED', portalType: 'manufacturer',
      title: 'Batch Approved by Lab',
      message: 'Batch BRAHKL0921TN (Brahmi Extract) passed quality testing with Grade A and is awaiting production.',
      batchId: 'BRAHKL0921TN', productName: 'Brahmi Extract',
      timestamp: '2026-08-24T15:10:00Z', isRead: false,
      farmerName: 'Lakshmi Iyer', farmerId: 'FRM-2214', grade: 'A', quantity: '120', unit: 'Kg'
    },
    {
      id: 'N1003', type: 'PRODUCTION_UPDATE', portalType: 'manufacturer',
      title: 'Production Status Updated',
      message: 'Batch ASHRJ0894RJ (Ashwagandha Capsules) has moved into In Production status.',
      batchId: 'ASHRJ0894RJ', productName: 'Ashwagandha Capsules',
      timestamp: '2026-08-25T09:05:00Z', isRead: true,
      farmerName: 'Vikram Singh', farmerId: 'FRM-2198', grade: 'A', quantity: '200', unit: 'Kg'
    },
    {
      id: 'N1004', type: 'BATCH_SENT_TO_MANUFACTURING', portalType: 'manufacturer',
      title: 'New Batch Sent to Manufacturing',
      message: 'Batch TULAP0733GJ (Tulsi Leaf Extract) has been approved by the lab and is ready for production.',
      batchId: 'TULAP0733GJ', productName: 'Tulsi Leaf Extract',
      timestamp: '2026-08-09T10:50:00Z', isRead: true,
      farmerName: 'Sita Devi', farmerId: 'FRM-2189', grade: 'B', quantity: '180', unit: 'Kg'
    }
  ];

  // ---- Product catalog (from src/data/mock.ts, MANUFACTURERS.MFG001) -----
  var CATALOG = {
    Shampoos: {
      'Himalaya Anti-Hair Fall Shampoo': ['Butea frondosa', 'Bhringraj', 'Chickpea'],
      'Himalaya Gentle Daily Care Shampoo': ['Aloe Vera', 'Chickpea'],
      'Himalaya Anti-Dandruff Shampoo': ['Tea Tree Oil', 'Aloe Vera'],
      'Himalaya Protein Shampoo - Softness & Shine': ['Licorice', 'Chickpea'],
      'Himalaya Damage Repair Protein Shampoo': ['Aloe Vera', 'Yarrow']
    },
    Paste: {
      'Himalaya Complete Care Toothpaste': ['Neem', 'Pomegranate', 'Miswak'],
      'Himalaya Sparkling White Toothpaste': ['Papaya', 'Pineapple'],
      'Himalaya Sensitive Toothpaste': ['Spinach', 'Almond'],
      'Himalaya Active Fresh Gel Toothpaste': ['Menthol', 'Miswak', 'Clove'],
      'Himalaya Stain Removal Toothpaste': ['Papaya', 'Pineapple']
    },
    Oils: {
      'Himalaya Anti-Hair Fall Hair Oil': ['Bhringraj', 'Amalaki'],
      'Himalaya Baby Massage Oil': ['Olive Oil', 'Winter Cherry'],
      'Himalaya Natural Shine Hair Oil': ['Amla', 'Methi', 'Hibiscus'],
      'Himalaya Stress Relief Massage Oil': ['Ashwagandha', 'Country Mallow'],
      'Himalaya Nourishing Skin Oil': ['Almond Oil', 'Olive Oil']
    },
    'Face Wash': {
      'Himalaya Purifying Neem Face Wash': ['Neem', 'Turmeric'],
      'Himalaya Oil Clear Lemon Face Wash': ['Lemon', 'Honey'],
      'Himalaya Moisturizing Aloe Vera Face Wash': ['Aloe Vera', 'Cucumber'],
      'Himalaya Men Natural Bright Face Wash': ['Licorice', 'White Pepper'],
      'Himalaya Tan Removal Orange Face Wash': ['Orange Peel', 'Honey']
    },
    Supplements: {
      'Himalaya Liv.52 Tablets': ['Capparis spinosa', 'Cichorium intybus'],
      'Himalaya Septilin Syrup/Tablets': ['Tinospora cordifolia', 'Licorice'],
      'Himalaya Ashwagandha Tablets': ['Ashwagandha root extract'],
      'Himalaya Gokshura Tablets': ['Tribulus terrestris'],
      'Himalaya Neem Tablets': ['Neem leaf extract']
    }
  };

  var COMPANY_NAME = 'Himalaya';

  // ---- Helpers --------------------------------------------------------

  function gradeClasses(grade) {
    if (grade === 'A') return { color: 'grade-A' };
    if (grade === 'B') return { color: 'grade-B' };
    if (grade === 'C') return { color: 'grade-C' };
    return { color: 'grade-NA' };
  }

  function buildBatchMap() {
    var map = {};
    MOCK_EVENTS.forEach(function (event) {
      var existing = map[event.batchId] || {};
      if (event.stage === 'farmer' && !existing.farmer) existing.farmer = event;
      if (event.stage === 'lab' && !existing.lab) existing.lab = event;
      if (event.stage === 'manufacturer' && !existing.manufacturer) existing.manufacturer = event;
      map[event.batchId] = existing;
    });
    return map;
  }

  function formatDateGB(iso) {
    var d = new Date(iso);
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var yyyy = d.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  }

  function toSortValue(dateGB) {
    // dd/mm/yyyy -> yyyy-mm-dd for correct chronological sorting
    var parts = dateGB.split('/');
    return new Date(parts[2] + '-' + parts[1] + '-' + parts[0]).getTime();
  }

  // Batches approved by lab, no manufacturer stage yet (used by both
  // "Production Orders" and "Approved by Lab" pages - matches source).
  function getApprovedByLab() {
    var map = buildBatchMap();
    var out = [];
    var gradeA = 0, gradeB = 0, gradeC = 0;
    Object.keys(map).forEach(function (batchId) {
      var stages = map[batchId];
      var farmer = stages.farmer, lab = stages.lab, manufacturer = stages.manufacturer;
      if (lab && lab.data && ['A', 'B', 'C'].indexOf(lab.data.qualityGrade) !== -1 && !manufacturer) {
        var grade = lab.data.qualityGrade;
        if (grade === 'A') gradeA++; else if (grade === 'B') gradeB++; else if (grade === 'C') gradeC++;
        out.push({
          id: batchId,
          productName: (farmer && farmer.data && farmer.data.productName) || 'Unknown',
          approvedDate: formatDateGB(lab.timestamp),
          grade: grade,
          quantity: ((farmer && farmer.data && farmer.data.quantityValue) || '0') + ' ' + ((farmer && farmer.data && farmer.data.quantityUnit) || 'Kg'),
          farmerName: (farmer && farmer.data && farmer.data.farmerName) || 'Unknown Farmer',
          labName: (lab.data && lab.data.labTechnicianName) || 'Lab Technician',
          gradeClass: gradeClasses(grade).color
        });
      }
    });
    out.sort(function (a, b) { return toSortValue(b.approvedDate) - toSortValue(a.approvedDate); });
    return { list: out, stats: { total: out.length, gradeA: gradeA, gradeB: gradeB, gradeC: gradeC } };
  }

  // Batches that have a manufacturer stage at all (any status) - matches
  // ManufacturerCompletedOrders.tsx logic exactly.
  function getCompletedOrders() {
    var map = buildBatchMap();
    var out = [];
    var gradeA = 0, gradeB = 0, gradeC = 0;
    Object.keys(map).forEach(function (batchId) {
      var stages = map[batchId];
      var farmer = stages.farmer, lab = stages.lab, manufacturer = stages.manufacturer;
      if (manufacturer && lab && lab.data && lab.data.qualityGrade) {
        var grade = lab.data.qualityGrade;
        if (grade === 'A') gradeA++; else if (grade === 'B') gradeB++; else if (grade === 'C') gradeC++;
        out.push({
          id: batchId,
          productName: (farmer && farmer.data && farmer.data.productName) || 'Unknown',
          completedDate: formatDateGB(manufacturer.timestamp),
          grade: grade,
          quantity: ((farmer && farmer.data && farmer.data.quantityValue) || '0') + ' ' + ((farmer && farmer.data && farmer.data.quantityUnit) || 'Kg'),
          farmerName: (farmer && farmer.data && farmer.data.farmerName) || 'Unknown Farmer',
          manufacturerName: (manufacturer.data && manufacturer.data.manufacturerName) || 'Manufacturer',
          gradeClass: gradeClasses(grade).color
        });
      }
    });
    out.sort(function (a, b) { return toSortValue(b.completedDate) - toSortValue(a.completedDate); });
    return { list: out, stats: { total: out.length, gradeA: gradeA, gradeB: gradeB, gradeC: gradeC } };
  }

  function getActiveBatches() {
    var map = buildBatchMap();
    var out = [];
    var totalDays = 0;
    Object.keys(map).forEach(function (batchId) {
      var stages = map[batchId];
      var farmer = stages.farmer, lab = stages.lab, manufacturer = stages.manufacturer;
      var status = (manufacturer && manufacturer.data && manufacturer.data.status) || '';
      if (manufacturer && (status === 'In Production' || status === 'Processing')) {
        var startDate = new Date(manufacturer.timestamp);
        var days = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += days;
        out.push({
          id: batchId,
          productName: (farmer && farmer.data && farmer.data.productName) || 'Unknown',
          startDate: formatDateGB(manufacturer.timestamp),
          status: status,
          quantity: ((farmer && farmer.data && farmer.data.quantityValue) || '0') + ' ' + ((farmer && farmer.data && farmer.data.quantityUnit) || 'Kg'),
          farmerName: (farmer && farmer.data && farmer.data.farmerName) || 'Unknown Farmer',
          grade: (lab && lab.data && lab.data.qualityGrade) || 'N/A',
          daysInProduction: days
        });
      }
    });
    out.sort(function (a, b) { return b.daysInProduction - a.daysInProduction; });
    return { list: out, stats: { total: out.length, avgDays: out.length ? Math.round(totalDays / out.length) : 0 } };
  }

  function getManufactured() {
    var map = buildBatchMap();
    var out = [];
    var gradeA = 0, gradeB = 0, gradeC = 0;
    Object.keys(map).forEach(function (batchId) {
      var stages = map[batchId];
      var farmer = stages.farmer, lab = stages.lab, manufacturer = stages.manufacturer;
      var status = (manufacturer && manufacturer.data && manufacturer.data.status) || '';
      if (manufacturer && (status === 'Manufactured' || status === 'Completed' || status === 'Ready')) {
        var grade = (lab && lab.data && lab.data.qualityGrade) || 'N/A';
        if (grade === 'A') gradeA++; else if (grade === 'B') gradeB++; else if (grade === 'C') gradeC++;
        var completionDate = new Date(manufacturer.timestamp);
        var startDate = new Date((farmer && farmer.timestamp) || manufacturer.timestamp);
        var days = Math.floor((completionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        out.push({
          id: batchId,
          productName: (farmer && farmer.data && farmer.data.productName) || 'Unknown',
          completionDate: formatDateGB(manufacturer.timestamp),
          status: status,
          quantity: ((farmer && farmer.data && farmer.data.quantityValue) || '0') + ' ' + ((farmer && farmer.data && farmer.data.quantityUnit) || 'Kg'),
          farmerName: (farmer && farmer.data && farmer.data.farmerName) || 'Unknown Farmer',
          grade: grade,
          daysToManufacture: days
        });
      }
    });
    out.sort(function (a, b) { return toSortValue(b.completionDate) - toSortValue(a.completionDate); });
    return { list: out, stats: { total: out.length, gradeA: gradeA, gradeB: gradeB, gradeC: gradeC } };
  }

  function getDispatched() {
    var map = buildBatchMap();
    var out = [];
    var gradeA = 0, gradeB = 0, gradeC = 0;
    Object.keys(map).forEach(function (batchId) {
      var stages = map[batchId];
      var farmer = stages.farmer, lab = stages.lab, manufacturer = stages.manufacturer;
      var status = (manufacturer && manufacturer.data && manufacturer.data.status) || '';
      if (manufacturer && (status === 'Dispatched' || status === 'Shipped')) {
        var grade = (lab && lab.data && lab.data.qualityGrade) || 'N/A';
        if (grade === 'A') gradeA++; else if (grade === 'B') gradeB++; else if (grade === 'C') gradeC++;
        out.push({
          id: batchId,
          productName: (farmer && farmer.data && farmer.data.productName) || 'Unknown',
          dispatchDate: formatDateGB(manufacturer.timestamp),
          status: status,
          quantity: ((farmer && farmer.data && farmer.data.quantityValue) || '0') + ' ' + ((farmer && farmer.data && farmer.data.quantityUnit) || 'Kg'),
          farmerName: (farmer && farmer.data && farmer.data.farmerName) || 'Unknown Farmer',
          grade: grade,
          destination: (manufacturer.data && manufacturer.data.destination) || 'Distribution Center'
        });
      }
    });
    out.sort(function (a, b) { return toSortValue(b.dispatchDate) - toSortValue(a.dispatchDate); });
    return { list: out, stats: { total: out.length, gradeA: gradeA, gradeB: gradeB, gradeC: gradeC } };
  }

  function getDashboardStats() {
    var approved = getApprovedByLab().stats.total;
    var active = getActiveBatches().stats.total;
    var manufactured = getManufactured().stats.total;
    var dispatched = getDispatched().stats.total;
    return { approvedByLab: approved, activeBatches: active, manufactured: manufactured, dispatched: dispatched };
  }

  function findBatchById(batchId) {
    var map = buildBatchMap();
    var stages = map[batchId];
    if (!stages) return null;
    return {
      id: batchId,
      farmer: stages.farmer || null,
      lab: stages.lab || null,
      manufacturer: stages.manufacturer || null
    };
  }

  global.MFR_DATA = {
    MOCK_EVENTS: MOCK_EVENTS,
    MOCK_NOTIFICATIONS: MOCK_NOTIFICATIONS,
    CATALOG: CATALOG,
    COMPANY_NAME: COMPANY_NAME,
    buildBatchMap: buildBatchMap,
    formatDateGB: formatDateGB,
    getApprovedByLab: getApprovedByLab,
    getCompletedOrders: getCompletedOrders,
    getActiveBatches: getActiveBatches,
    getManufactured: getManufactured,
    getDispatched: getDispatched,
    getDashboardStats: getDashboardStats,
    findBatchById: findBatchById,
    gradeClasses: gradeClasses
  };
})(window);
