// src/consumerportal/src/components/ProductTimeline.tsx
import { useEffect, useMemo, useState } from 'react';
import type { LedgerEvent } from '../types';

interface ProductTimelineProps {
  timeline: LedgerEvent[];
}

interface HeavyMetals {
  Pb?: string | number;
  As?: string | number;
  Cd?: string | number;
  Hg?: string | number;
}

export default function ProductTimeline({ timeline }: ProductTimelineProps) {
  const [events, setEvents] = useState<LedgerEvent[]>([]);

  useEffect(() => {
    setEvents(Array.isArray(timeline) ? timeline : []);
  }, [timeline]);

  const farmer = useMemo(() => events.find(e => e.stage === 'farmer'), [events]);
  const lab = useMemo(() => events.find(e => e.stage === 'lab'), [events]);
  const manufacturer = useMemo(() => events.find(e => e.stage === 'manufacturer'), [events]);

  const farmerData = (farmer?.data ?? {}) as any;
  const labData = (lab?.data ?? {}) as any;
  const manufData = (manufacturer?.data ?? {}) as any;

  if (!events || events.length === 0) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-gray-500">No events available for this product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="mx-auto max-w-5xl px-4 space-y-10">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
          <p className="text-gray-600 mt-1">End-to-end traceability view</p>
        </header>

        {/* Manufactured Summary */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Manufactured Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Company Name" value={manufData.companyName} />
            <Field label="Manufactured Batch ID" value={manufData.manufacturedBatchId} />
            <Field label="Product Name" value={manufData.productName ?? manufData.product ?? farmerData.productName} />
            <Field label="Product Type" value={manufData.productType} />
            <Field label="Ingredients" value={manufData.ingredients} full />
            <Field label="Added By" value={manufacturer?.addedBy} />
            <Field label="Date & Time" value={formatDate(manufacturer?.timestamp)} />
          </div>
        </section>

        {/* Raw Products */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Raw Products</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2">Batch ID</th>
                  <th className="px-4 py-2">Product Name</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 align-top">{farmer?.batchId}</td>
                  <td className="px-4 py-2 align-top">{farmerData.productName}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Harvest History */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Harvest History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Product" value={farmerData.productName} />
            <Field label="Quantity" value={extractQuantityValue(farmerData.quantity)} />
            <Field label="Unit" value={extractQuantityUnit(farmerData.quantity)} />
            <Field label="Harvested Date" value={farmerData.harvestedDate ?? farmerData.harvestedDateISO} />
            <Field label="Latitude" value={farmerData.coordinates?.latitude ?? farmerData.latitude} />
            <Field label="Longitude" value={farmerData.coordinates?.longitude ?? farmerData.longitude} />
            <Field label="State" value={farmerData.state} />
            <Field label="District" value={farmerData.district} />
            <Field label="Village/Town" value={farmerData.villageTown} />
            <Field label="Added By" value={farmer?.addedBy} />
            <Field label="Created Date and Time" value={formatDate(farmer?.timestamp)} />
          </div>
        </section>

        {/* Lab Test History */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lab Test History</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Product Name" value={farmerData.productName} />
            <Field label="Moisture %" value={labData.moisture} />
            <Field label="Pesticide ppm" value={labData.pesticide} />
            <Field label="Quality Grade" value={labData.quality ?? labData.qualityGrade} />
            <Field label="Tested By" value={labData.testedBy} />
            <Field label="Added By" value={lab?.addedBy} />
            <Field label="Tested At (ISO)" value={labData.testedAtISO} />
            <Field label="Date & Time" value={formatDate(lab?.timestamp)} />
          </div>
        </section>

        {/* Core Tests */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Pesticide Residues" value={labData.pesticideResidues} />
            <Field label="Microbial Load" value={labData.microbialLoad} />
            <Field label="Aflatoxins" value={labData.aflatoxins} />
            <Field label="Moisture Water Activity" value={labData.moistureWaterActivity} />
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Heavy Metals (Pb, As, Cd, Hg)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Pb" value={(labData.heavyMetals as HeavyMetals)?.Pb} />
                <Field label="As" value={(labData.heavyMetals as HeavyMetals)?.As} />
                <Field label="Cd" value={(labData.heavyMetals as HeavyMetals)?.Cd} />
                <Field label="Hg" value={(labData.heavyMetals as HeavyMetals)?.Hg} />
              </div>
            </div>
          </div>
        </section>

        {/* Ayurvedic Pharmacopoeial Quality Tests */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ayurvedic Pharmacopoeial Quality Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Macro/Micro Identity" value={labData.macroMicroIdentity} />
            <Field label="Total Ash (total / acid-insoluble)" value={labData.totalAsh} />
            <Field label="Extractive Values" value={labData.extractiveValues} />
            <Field label="Foreign Organic Matter" value={labData.foreignOrganicMatter} />
            <Field label="TLC / HPTLC Fingerprint" value={labData.tlcHptlc} />
            <Field label="Marker Compound Quantification" value={labData.markerCompoundQuant} />
          </div>
        </section>

        {/* Export-Grade Fields */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Export-Grade Fields</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <Field label="Residual Solvents" value={labData.residualSolvents} />
            <Field label="Pesticide Panel Confirmation" value={labData.pesticidePanelConfirmation} />
            <Field label="DNA Barcoding" value={labData.dnaBarcoding} />
          </div>
        </section>
      </div>
        </div>
  );
}

function Field({ label, value, full }: { label: string; value: any; full?: boolean }) {
  const display = value === undefined || value === null || value === '' ? '-' : String(value);
  return (
    <div className={full ? 'md:col-span-2' : undefined}>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-gray-900 text-sm mt-0.5 break-words">{display}</div>
    </div>
  );
}

function formatDate(iso?: string) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

function extractQuantityValue(quantity?: string) {
  if (!quantity) return '-';
  const match = String(quantity).match(/^[\d.]+/);
  return match ? match[0] : quantity;
}

function extractQuantityUnit(quantity?: string) {
  if (!quantity) return '-';
  const match = String(quantity).match(/[A-Za-z]+$/);
  return match ? match[0] : '-';
}
