// src/manufportal/src/App.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ManufacturingForm from './components/ManufacturingForm';
import QRView from './components/QRView';
import { MANUFACTURERS } from './data/mock';
import type { AppSession, ManufacturedBatch, RawBatch, LedgerEvent, LabResult } from '../../types';

export default function App() {
  const [session, setSession] = useState<AppSession | null>(null);
  const [rawBatches, setRawBatches] = useState<RawBatch[]>([]);
  const [manufactured, setManufactured] = useState<ManufacturedBatch[]>([]);
  const navigate = useNavigate();

  // Load raw batches from the shared ledger (farmer events) and enrich with lab test data (lab events).
  // Also detect which raw batches have already been manufactured (manufacturer events) to exclude them from the tested list
  useEffect(() => {
    async function loadFromLedger() {
      try {
        const res = await fetch('http://localhost:3001/events');
        const events: LedgerEvent[] = await res.json();

        // Track manufactured raw batch IDs
        const manufacturedSet = new Set<string>();
        for (const ev of events) {
          if (ev.stage === 'manufacturer') manufacturedSet.add(ev.batchId);
        }

        // Group by batchId
        const byBatch = new Map<string, { farmer?: LedgerEvent; lab?: LedgerEvent; manufactured?: boolean }>();
        for (const ev of events) {
          const current = (byBatch.get(ev.batchId) || {}) as any;
          if (ev.stage === 'farmer' && !current.farmer) current.farmer = ev;
          if (ev.stage === 'lab' && !current.lab) current.lab = ev;
          if (ev.stage === 'manufacturer') current.manufactured = true;
          byBatch.set(ev.batchId, current);
        }

        const next: RawBatch[] = [];
        for (const [id, pair] of byBatch.entries()) {
          if (!pair.farmer) continue; // need farmer base data
          const f = pair.farmer;
          const farmerData: any = f.data || {};
          const lab = pair.lab;
          let labTest: LabResult | undefined = undefined;
          if (lab) {
            const labData: any = lab.data || {};
            labTest = {
              batchId: id,
              labId: labData.labId || 'LAB001',
              testedBy: labData.testedBy || lab.addedBy || '',
              testedAtISO: labData.testedAtISO || lab.timestamp || new Date().toISOString(),
              moisture: labData.moisture ?? 0,
              pesticide: labData.pesticide ?? 0,
              quality: labData.quality ?? '-',
              labStaff: labData.testedBy || lab.addedBy || undefined,
            } as LabResult;
          }

          next.push({
            id,
            productName: farmerData.productName ?? '-',
            farmer: {
              name: farmerData.farmerName || farmerData.farmerId || f.addedBy || '-',
              farmerId: farmerData.farmerId || '-',
              location: farmerData.location || '-',
            },
            collectionDate: farmerData.harvestedDate || f.timestamp,
            labTest,
            status: pair.manufactured ? 'MANUFACTURED' : lab ? 'TESTED & READY' : 'PENDING',
          });
        }
        setRawBatches(next);
      } catch (e) {
        setRawBatches([]);
        console.error('Failed to load events for manufacturer dashboard', e);
      }
    }
    loadFromLedger();
  }, []);

  // Only show batches that have a lab test event present and are not yet manufactured
  const testedReady = useMemo(() => rawBatches.filter(b => !!b.labTest && b.status !== 'MANUFACTURED'), [rawBatches]);

  function handleLogin(manufacturerId: string) {
    const conf = MANUFACTURERS['MFG001'];
    setSession({ companyName: conf.name, catalog: conf.products });
    navigate('/dashboard');
  }

  function addManufacturedBatch(batch: ManufacturedBatch) {
    setManufactured(prev => [batch, ...prev]);
    // Remove manufactured raw batches from the dashboard list immediately
    const manufacturedIds = new Set(batch.rawBatches.map(rb => rb.id));
    setRawBatches(prev => prev.map(rb => manufacturedIds.has(rb.id) ? { ...rb, status: 'MANUFACTURED' } : rb));
  }

  return (
    <div className="min-h-full text-gray-900">
      <Header session={session} onLogout={() => { setSession(null); navigate('/'); }} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={session ? <Dashboard batches={testedReady} onProceed={(ids) => navigate(`/manufacture`, { state: { selectedIds: ids } })} /> : <Navigate to="/" replace />} />
          <Route path="/manufacture" element={session ? <ManufacturingForm rawBatches={rawBatches} session={session} onCreate={addManufacturedBatch} /> : <Navigate to="/" replace />} />
          <Route path="/qr/:batchId" element={session ? <QRView manufactured={manufactured} /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function Header({ session, onLogout }: { session: AppSession | null; onLogout: () => void }) {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold">
          <span className="text-brand-blue">Manufacturer</span>{' '}
          <span className="text-brand-green">Portal</span>
        </div>
        <div className="text-sm">
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">{session.companyName}</span>
              <button onClick={onLogout} className="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-blue">Logout</button>
            </div>
          ) : <span className="text-gray-500">Please login</span>}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-500">
        Minimal demo • Green/Blue accents • No animations
      </div>
    </footer>
  );
}
