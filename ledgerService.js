import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEDGER_FILE = path.join(__dirname, 'ledger.json');

class LedgerService {
  constructor() {
    this.ledger = [];
    this.loadLedger();
  }

  loadLedger() {
    try {
      if (fs.existsSync(LEDGER_FILE)) {
        const data = fs.readFileSync(LEDGER_FILE, 'utf8');
        this.ledger = JSON.parse(data);
      } else {
        this.ledger = [];
        this.saveLedger();
      }
    } catch (error) {
      console.error('Error loading ledger:', error);
      this.ledger = [];
    }
  }

  saveLedger() {
    try {
      fs.writeFileSync(LEDGER_FILE, JSON.stringify(this.ledger, null, 2));
    } catch (error) {
      console.error('Error saving ledger:', error);
    }
  }

  addEvent(event) {
    const newEvent = {
      batchId: event.batchId,
      stage: event.stage,
      data: event.data,
      addedBy: event.addedBy,
      timestamp: new Date().toISOString()
    };

    this.ledger.push(newEvent);
    this.saveLedger();
    return newEvent;
  }

  getEvents() {
    return [...this.ledger];
  }

  getEventsByBatchId(batchId) {
    return this.ledger.filter(event => event.batchId === batchId);
  }

  getEventsByStage(stage) {
    return this.ledger.filter(event => event.stage === stage);
  }

  getTestedBatches() {
    const labEvents = this.getEventsByStage('lab');
    return [...new Set(labEvents.map(event => event.batchId))];
  }
}

const ledgerServiceInstance = new LedgerService();

export const addEvent = (event) => ledgerServiceInstance.addEvent(event);
export const getEvents = () => ledgerServiceInstance.getEvents();
export const getEventsByBatchId = (batchId) => ledgerServiceInstance.getEventsByBatchId(batchId);
export const getEventsByStage = (stage) => ledgerServiceInstance.getEventsByStage(stage);
export const getTestedBatches = () => ledgerServiceInstance.getTestedBatches();

export default ledgerServiceInstance;
