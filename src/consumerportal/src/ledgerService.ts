import { LedgerEvent } from './types';

export const ledgerService = {
  async getEvents(batchId: string): Promise<LedgerEvent[]> {
    try {
      const response = await fetch(`/api/ledger/events/${batchId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events from ledger');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events from ledger:', error);
      return [];
    }
  },

  async getAllEvents(): Promise<LedgerEvent[]> {
    try {
      const response = await fetch('/api/ledger/events');
      if (!response.ok) {
        throw new Error('Failed to fetch all events from ledger');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all events from ledger:', error);
      return [];
    }
  }
};

