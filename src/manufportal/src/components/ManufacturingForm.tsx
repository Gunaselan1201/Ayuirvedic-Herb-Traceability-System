import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AppSession, ManufacturedBatch, RawBatch } from '../../../types';
import { formatFriendlyDateTime } from '../lib/format';
import { v4 as uuidv4 } from 'uuid';

type LocationState = { selectedIds: string[] };

export default function ManufacturingForm({
  rawBatches,
  session,
  onCreate,
}: {
  rawBatches: RawBatch[];
  session: AppSession;
  onCreate: (batch: ManufacturedBatch) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedIds = [] } = (location.state as LocationState) || {};
  const selectedRaw: RawBatch[] = useMemo(
    () => rawBatches.filter(b => selectedIds.includes(b.id)),
    [rawBatches, selectedIds]
  );

  const now = useMemo(() => new Date(), []);
  const defaultName = selectedRaw[0]?.productName ?? '';
  const availableTypes = useMemo(() => Object.keys(session.catalog || {}) as ManufacturedBatch['productType'][], [session.catalog]);
  const initialType: ManufacturedBatch['productType'] = (availableTypes[0] as any) || 'Powder';
  const [productType, setProductType] = useState<ManufacturedBatch['productType']>(initialType);
  const productNames = useMemo(() => Object.keys(session.catalog?.[productType] || {}), [session.catalog, productType]);
  const [productName, setProductName] = useState(defaultName || productNames[0] || '');
  const [ingredients, setIngredients] = useState('');
  const [addedBy, setAddedBy] = useState('');
  const [error, setError] = useState<string | null>(null);

  const manufacturedAt = now.toISOString();
  const manufacturedAtFriendly = formatFriendlyDateTime(now);
  const manufacturedBatchId = `MFG-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${uuidv4().slice(0,8).toUpperCase()}`;

  // Autofill: when productType/name matches catalog, prefill ingredients
  function tryAutofillIngredients(pt: string, pn: string) {
    const list = session.catalog?.[pt]?.[pn];
    if (list && Array.isArray(list)) {
      setIngredients(list.join(', '));
    }
  }

  React.useEffect(() => {
    if (!ingredients && productType && productName) {
      tryAutofillIngredients(productType, productName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (selectedRaw.length === 0) return setError('Select at least one raw batch from dashboard');
    if (!productName.trim()) return setError('Product Name is required');
    if (!ingredients.trim()) return setError('Ingredients are required');
    if (!addedBy.trim()) return setError('Added By is required');

    const batch: ManufacturedBatch = {
      manufacturedBatchId,
      companyName: session.companyName,
      productName: productName.trim(),
      productType,
      ingredients: ingredients.trim(),
      addedBy: addedBy.trim(),
      manufacturedAt,
      rawBatches: selectedRaw,
    };

    try {
      // Add to shared ledger for each raw batch
      for (const rawBatch of selectedRaw) {
        const response = await fetch('http://localhost:3001/add-event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            batchId: rawBatch.id,
            stage: 'manufacturer',
            data: {
              productType,
              ingredients: ingredients.trim(),
              companyName: session.companyName,
              manufacturedBatchId
            },
            addedBy: addedBy.trim()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save to ledger');
        }
      }

      onCreate(batch);
      navigate(`/qr/${manufacturedBatchId}`);
    } catch (error) {
      console.error('Error adding to ledger:', error);
      setError('Failed to save to ledger. Please try again.');
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Manufacturing Data Entry</h1>
      <div className="mb-4 text-sm text-gray-700">Using {selectedRaw.length} raw batch(es).</div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="manufacturedBatchId" className="block text-sm font-medium text-gray-700">New Manufactured Batch ID</label>
            <input readOnly id="manufacturedBatchId" value={manufacturedBatchId} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input readOnly value={`${manufacturedAt} (${manufacturedAtFriendly})`} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-gray-50" />
          </div>
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <select
              id="productName"
              value={productName}
              onChange={(e) => {
                const next = e.target.value;
                setProductName(next);
                tryAutofillIngredients(productType, next);
              }}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="">Select product</option>
              {productNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Product Type</label>
            <select
              id="productType"
              value={productType}
              onChange={(e) => {
                const next = e.target.value as ManufacturedBatch['productType'];
                setProductType(next);
                const names = Object.keys(session.catalog?.[next] || {});
                const first = names[0] || '';
                setProductName(first);
                setIngredients('');
                if (first) tryAutofillIngredients(next, first);
              }}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              {(availableTypes.length ? availableTypes : ['Powder','Capsule','Paste','Oil','Syrup','Shampoo']).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">Ingredients</label>
            <textarea id="ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue" rows={4} placeholder="Comma-separated list; will autofill if product matches catalog" />
          </div>
          <div>
            <label htmlFor="addedBy" className="block text-sm font-medium text-gray-700">Added By</label>
            <input id="addedBy" value={addedBy} onChange={(e) => setAddedBy(e.target.value)} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Staff name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input readOnly value={session.companyName} className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 bg-gray-50" />
          </div>
        </div>
        <div className="mt-6 border border-gray-200 rounded p-4">
          <div className="text-sm font-medium text-gray-800 mb-2">Selected Raw Batches</div>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            {selectedRaw.map(rb => (
              <li key={rb.id}>
                {rb.id} — {rb.productName} — {rb.farmer.name} ({rb.farmer.farmerId}), {rb.farmer.location}; {rb.labTest ? <>Tested {new Date(rb.labTest.testedAtISO).toLocaleString()} {rb.labTest.labStaff ? <>by {rb.labTest.labStaff} </> : null}— Moist {rb.labTest.moisture}% · Pest {rb.labTest.pesticide} ppm · Grade {rb.labTest.quality}</> : <span className="text-gray-500">No lab data</span>}
              </li>
            ))}
          </ul>
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <div className="mt-6">
          <button type="submit" className="w-full md:w-auto rounded bg-gradient-to-r from-brand-green to-brand-blue text-white px-6 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
            Submit & Create Manufactured Batch
          </button>
        </div>
      </form>
    </section>
  );
}


