// src/consumerportal/src/types.ts

export interface LedgerEvent {
  id: string;
  batchId: string;
  stage: string;
  data: Record<string, any>;
  addedBy: string;
  timestamp: string; // matches ProductTimeline.tsx usage
}

export interface ProductTimeline {
  batchId: string;
  events: LedgerEvent[];
}
