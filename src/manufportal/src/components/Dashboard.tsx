import React from 'react';
import type { RawBatch } from '../../../types';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ batches, onProceed }: { batches: RawBatch[]; onProceed: (selectedIds: string[]) => void }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [testedBatches, setTestedBatches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestedBatches = async () => {
      try {
        const response = await fetch('http://localhost:3001/tested-batches');
        if (response.ok) {
          const tested = await response.json();
          setTestedBatches(tested);
        }
      } catch (error) {
        console.error('Error fetching tested batches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestedBatches();
  }, []);

  // Filter batches to only show those that have been tested in the ledger
  const testedBatchesList = useMemo(() => 
    batches.filter(b => testedBatches.includes(b.id)), 
    [batches, testedBatches]
  );

  const allIds = useMemo(() => testedBatchesList.map(b => b.id), [testedBatchesList]);
  const selectedIds = useMemo(() => allIds.filter(id => selected[id]), [allIds, selected]);

  function toggle(id: string, checked: boolean) {
    setSelected(prev => ({ ...prev, [id]: checked }));
  }

  function toggleAll(checked: boolean) {
    const next: Record<string, boolean> = {};
    for (const id of allIds) next[id] = checked;
    setSelected(next);
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Raw Batches — Tested & Ready</h1>
      {loading && <div className="text-gray-600 mb-4">Loading tested batches from ledger...</div>}
      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="min-w-full text-left text-sm">
          <thead className="text-gray-600 bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="py-3 pr-4 w-10">
                <input aria-label="Select all" type="checkbox" className="h-4 w-4" onChange={(e) => toggleAll(e.target.checked)} checked={selectedIds.length === allIds.length && allIds.length > 0} />
              </th>
              <th className="py-3 pr-4">Raw Batch ID</th>
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Farmer</th>
              <th className="py-3 pr-4">Lab Test Details</th>
            </tr>
          </thead>
          <tbody>
            {testedBatchesList.map((b) => (
              <tr key={b.id} className="border-b border-gray-100">
                <td className="py-3 pr-4">
                  <input aria-label={`Select ${b.id}`} type="checkbox" className="h-4 w-4" checked={!!selected[b.id]} onChange={(e) => toggle(b.id, e.target.checked)} />
                </td>
                <td className="py-3 pr-4">{b.id}</td>
                <td className="py-3 pr-4">{b.productName}</td>
                <td className="py-3 pr-4 text-gray-700">
                  {b.farmer.name} · {b.farmer.location} · {b.farmer.farmerId}
                </td>
                <td className="py-3 pr-4 text-gray-700">
                  {b.labTest ? (
                    <>Moist {b.labTest.moisture}% · Pest {b.labTest.pesticide} ppm · Grade {b.labTest.quality}{b.labTest.labStaff ? ` · ${b.labTest.labStaff}` : ''} · {new Date(b.labTest.testedAtISO).toLocaleString()} </>
                  ) : (
                    <span className="text-gray-500">No lab data</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Selected: {selectedIds.length}</div>
        <button
          onClick={() => onProceed(selectedIds)}
          disabled={selectedIds.length === 0}
          className="rounded bg-gradient-to-r from-brand-green to-brand-blue disabled:opacity-50 text-white px-5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          Proceed to Manufacturing
        </button>
      </div>
    </section>
  );
}


