// Lightweight blockchain service wrapper for Farmer Portal (Phase 1)
const API_BASE = 'http://localhost:3001';

export async function getEvents() {
  try {
    const resp = await fetch(`${API_BASE}/events`);
    if (!resp.ok) throw new Error('Network response was not ok');
    const json = await resp.json();
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error('blockchainService.getEvents error:', err);
    return [];
  }
}

export async function postBatch(data) {
  try {
    const resp = await fetch(`${API_BASE}/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error('Failed to post batch');
    return await resp.json();
  } catch (err) {
    console.error('blockchainService.postBatch error:', err);
    throw err;
  }
}

export default {
  getEvents,
  postBatch
};
