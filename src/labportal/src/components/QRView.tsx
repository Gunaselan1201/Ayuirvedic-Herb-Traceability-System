import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { ManufacturedBatch, RawBatch } from '../../../types';
import { QRCodeSVG } from 'qrcode.react';

export default function QRView({ manufactured }: { manufactured: ManufacturedBatch[] }) {
  const { batchId } = useParams();
  const batch = useMemo(() => manufactured.find(b => b.manufacturedBatchId === batchId), [manufactured, batchId]);

  if (!batch) {
    return <p className="text-red-700">QR not available. Create a manufactured batch first.</p>;
  }

  const payload = {
    id: batch.manufacturedBatchId,
    companyName: batch.companyName,
    product: { name: batch.productName, type: batch.productType, ingredients: batch.ingredients },
    manufacturing: { addedBy: batch.addedBy, timestampISO: batch.manufacturedAt, timestampFriendly: new Date(batch.manufacturedAt).toLocaleString() },
    rawBatches: batch.rawBatches,
  };
  const json = JSON.stringify(payload);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">QR — Consumer View</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="border border-gray-200 rounded p-4" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-center py-4">
            <QRCodeSVG value={json} size={220} />
          </div>
          <p className="text-xs text-gray-500 break-all">{json}</p>
        </div>
        <div className="space-y-3">
          <Detail label="Company Name" value={payload.companyName} />
          <Detail label="Manufactured Batch ID" value={payload.id} />
          <Detail label="Product Name" value={payload.product.name} />
          <Detail label="Product Type" value={payload.product.type} />
          <Detail label="Ingredients" value={payload.product.ingredients} />
          <Detail label="Manufacturing Date" value={payload.manufacturing.timestampFriendly} />
          <Detail label="Added By" value={payload.manufacturing.addedBy} />
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500">Raw Batches</div>
            <ul className="mt-1 space-y-1 text-gray-900 text-sm list-disc pl-5">
              {batch.rawBatches.map((rb: RawBatch) => (
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


