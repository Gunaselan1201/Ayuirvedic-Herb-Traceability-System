import type { LedgerEvent } from '../../types';

const BASE_URL = 'http://localhost:3001';

// Fetch all events
export async function fetchAllEvents(): Promise<LedgerEvent[]> {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

// Fetch events by batch ID
export async function fetchEventsByBatch(batchId: string): Promise<LedgerEvent[]> {
  const res = await fetch(`${BASE_URL}/events/${batchId}`);
  if (!res.ok) throw new Error('Failed to fetch batch events');
  return res.json();
}

// Submit new event (if consumer can add feedback or verification)
export async function submitEvent(event: LedgerEvent): Promise<LedgerEvent> {
  const res = await fetch(`${BASE_URL}/add-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to submit event');
  return res.json();
}
