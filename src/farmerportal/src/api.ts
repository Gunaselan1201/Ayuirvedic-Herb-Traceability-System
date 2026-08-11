// api.ts — Farmer Portal

import type { FarmerRecord, LedgerEvent } from '../../types';

const BASE_URL = 'http://localhost:3001';

// Fetch all ledger events for a batch
export async function fetchEventsByBatch(batchId: string): Promise<LedgerEvent[]> {
  const res = await fetch(`${BASE_URL}/events/${batchId}`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

// Submit a ledger event
export async function submitEvent(event: LedgerEvent): Promise<LedgerEvent> {
  const res = await fetch(`${BASE_URL}/add-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to submit event');
  return res.json();
}

// Add a farmer batch record by appending a 'farmer' event to the ledger
export async function addFarmerBatch(payload: any) {
  const event: LedgerEvent = {
    batchId: payload.batchId,
    stage: 'farmer',
    addedBy: payload.addedBy,
    data: {
      productName: payload.productName,
      quantity: payload.quantity,
      location: payload.location,
      harvestedDate: payload.harvestedDate,
      coordinates: payload.coordinates,
      farmerId: payload.farmerId,
    },
  } as any;
  const res = await fetch(`${BASE_URL}/add-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to add farmer batch');
  return res.json();
}
