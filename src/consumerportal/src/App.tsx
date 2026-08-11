// src/consumerportal/src/App.tsx
import { useEffect, useState } from 'react';
import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import ProductTimeline from './components/ProductTimeline';
import ConsumerDashboard from './components/ConsumerDashboard';
import type { LedgerEvent } from './types';

export default function App() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<ConsumerDashboard />} />
        <Route path="/timeline/:batchId" element={<TimelineWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function TimelineWrapper() {
  const { batchId } = useParams<{ batchId: string }>();
  const [timeline, setTimeline] = useState<LedgerEvent[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/events/${batchId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setTimeline(data);
      } catch {
        setTimeline([]);
      }
    }
    if (batchId) load();
  }, [batchId]);

  return <ProductTimeline timeline={timeline} />;
}
