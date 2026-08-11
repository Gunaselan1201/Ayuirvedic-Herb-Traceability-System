import type { RawBatch } from '../../../types';

export const initialRawBatches: RawBatch[] = [
  {
    id: 'SURTN1201NE',
    productName: 'Ashwagandha Root',
    farmer: { name: 'Ravi Kumar', location: 'Surat, Gujarat', farmerId: 'FRM101' },
    collectionDate: '2025-08-28',
    labTest: { batchId: 'SURTN1201NE', labId: 'LAB001', testedBy: 'Dr. Mehta', moisture: 7.8, pesticide: 0.3, quality: 'A', labStaff: 'Dr. Mehta', testedAtISO: '2025-09-01T10:30:00Z' } as any,
    status: 'TESTED',
  },
  {
    id: 'KRLTV0915SW',
    productName: 'Turmeric',
    farmer: { name: 'Sita Devi', location: 'Alappuzha, Kerala', farmerId: 'FRM202' },
    collectionDate: '2025-09-10',
    labTest: { batchId: 'KRLTV0915SW', labId: 'LAB001', testedBy: 'Dr. Varma', moisture: 6.2, pesticide: 0.1, quality: 'A', labStaff: 'Dr. Varma', testedAtISO: '2025-09-12T14:10:00Z' } as any,
    status: 'TESTED',
  },
  {
    id: 'MHNGP1022SE',
    productName: 'Tulsi Leaves',
    farmer: { name: 'Arun Patil', location: 'Nagpur, Maharashtra', farmerId: 'FRM303' },
    collectionDate: '2025-09-05',
    labTest: { batchId: 'MHNGP1022SE', labId: 'LAB001', testedBy: 'Dr. Kulkarni', moisture: 8.5, pesticide: 0.5, quality: 'B', labStaff: 'Dr. Kulkarni', testedAtISO: '2025-09-07T09:00:00Z' } as any,
    status: 'TESTED',
  },
];


