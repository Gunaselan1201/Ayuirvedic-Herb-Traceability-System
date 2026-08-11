// src/manufportal/src/components/QRView.tsx
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { ManufacturedBatch } from '../../../types';
import { QRCodeSVG } from 'qrcode.react';

export default function QRView({ manufactured }: { manufactured: ManufacturedBatch[] }) {
  const { batchId } = useParams();
  const batch = useMemo(
    () => manufactured.find(b => b.manufacturedBatchId === batchId),
    [manufactured, batchId]
  );

  if (!batch) {
    return <p className="text-red-700">QR not available. Create a manufactured batch first.</p>;
  }

  // Point QR to standalone consumer page with the manufactured batch ID
  const consumerUrl = `http://localhost:3001/consumer.html?batchId=${encodeURIComponent(batch.manufacturedBatchId)}`;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">QR — Consumer View</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="border border-gray-200 rounded p-4" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-center py-4">
            <QRCodeSVG value={consumerUrl} size={220} />
          </div>
          <p className="text-xs text-gray-500 break-all">{consumerUrl}</p>
        </div>
        <div className="space-y-3">
          <Detail label="Company Name" value={batch.companyName} />
          <Detail label="Manufactured Batch ID" value={batch.manufacturedBatchId} />
          <Detail label="Product Name" value={batch.productName} />
          <Detail label="Product Type" value={batch.productType} />
          <Detail label="Ingredients" value={batch.ingredients} />
          <Detail label="Manufacturing Date" value={new Date(batch.manufacturedAt).toLocaleString()} />
          <Detail label="Added By" value={batch.addedBy} />
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Raw Batches</div>
            <ul className="mt-1 space-y-1 text-gray-900 text-sm list-disc pl-5">
              {batch.rawBatches.map((rb) => (
                <li key={rb.id}>
                  {rb.id} — {rb.productName} — {rb.farmer.name} ({rb.farmer.farmerId}), {rb.farmer.location} — {rb.labTest ? <>Moist {rb.labTest.moisture}% · Pest {rb.labTest.pesticide} ppm · Grade {rb.labTest.quality}</> : <span className="text-gray-500">No lab data</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-base text-gray-900">{value}</div>
    </div>
  );
}
