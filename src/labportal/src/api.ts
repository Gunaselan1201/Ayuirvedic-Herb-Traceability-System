import type { LabBatch, LabResult, LedgerEvent } from '../../types';

const BASE_URL = 'http://localhost:3001'; // single declaration

// ✅ Fetch all ledger events
export async function fetchAllEvents(): Promise<LedgerEvent[]> {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

// ✅ Fetch events for a batch
export async function fetchEventsByBatch(batchId: string): Promise<LedgerEvent[]> {
  const res = await fetch(`${BASE_URL}/events/${batchId}`);
  if (!res.ok) throw new Error('Failed to fetch batch events');
  return res.json();
}

// ✅ Submit lab result to ledger
export async function submitLabResult(result: LabResult): Promise<LedgerEvent> {
  const event: LedgerEvent = {
    batchId: result.batchId,
    stage: 'lab',
    addedBy: result.testedBy,
    data: {
      testedAtISO: result.testedAtISO,
      moisture: result.moisture,
      pesticide: result.pesticide,
      quality: result.quality,
    }
  };

  const res = await fetch(`${BASE_URL}/add-event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });

  if (!res.ok) throw new Error('Failed to submit lab result');
  return res.json();
}

// ✅ Fetch tested batch IDs
export async function fetchTestedBatches(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/tested-batches`);
  if (!res.ok) throw new Error('Failed to fetch tested batches');
  return res.json();
}
