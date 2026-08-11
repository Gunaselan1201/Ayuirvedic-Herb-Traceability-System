import React, { useMemo, useState } from 'react';
import type { FarmerRecord, ProductName, QuantityUnit } from '../../../types';  // ✅ fixed path
import { formatDDMM } from '../lib/format';
import { addFarmerBatch } from '../api';

const herbList = [
  'Neem','Tulsi','Aloe Vera','Ashwagandha','Amla','Brahmi','Shatavari','Giloy',
  'Haritaki','Baheda','Triphala','Turmeric','Ginger','Licorice','Gokshura','Coconut'
] as const;

type Herb = typeof herbList[number];

const productCodes: Record<Herb, string> = {
  'Neem': 'NE','Tulsi': 'TU','Aloe Vera': 'AV','Ashwagandha': 'AS',
  'Amla': 'AM','Brahmi': 'BR','Shatavari': 'SH','Giloy': 'GI',
  'Haritaki': 'HA','Baheda': 'BA','Triphala': 'TR','Turmeric': 'TU2',
  'Ginger': 'GN','Licorice': 'LI','Gokshura': 'GK','Coconut': 'CO',
};

const stateOptions = [
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'KL', name: 'Kerala' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'TS', name: 'Telangana' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'WB', name: 'West Bengal' },
  { code: 'OD', name: 'Odisha' },
  { code: 'PB', name: 'Punjab' },
  { code: 'HR', name: 'Haryana' },
  { code: 'BR', name: 'Bihar' },
];

export default function FarmerForm({ farmerId, onSubmitRecord }: { farmerId: string; onSubmitRecord: (r: FarmerRecord) => void }) {
  const [productName, setProductName] = useState<Herb>('Coconut');
  const [quantityValue, setQuantityValue] = useState<number>(0);
  const [quantityUnit, setQuantityUnit] = useState<QuantityUnit>('Kg');
  const [harvestedDate, setHarvestedDate] = useState<string>('');
  const [stateCode, setStateCode] = useState<string>('TN');
  const [villageTown, setVillageTown] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [addedBy, setAddedBy] = useState<string>('');
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const createdAtISO = useMemo(() => new Date().toISOString(), []);
  const createdAtDisplay = useMemo(() => {
    const d = new Date(createdAtISO);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(d);
  }, [createdAtISO]);

  function generateBatchId(): string {
    const farmerPrefix = farmerId.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 3);
    const ddmm = formatDDMM(new Date(createdAtISO));
    const productCode = productCodes[productName];
    return `${farmerPrefix}${stateCode}${ddmm}${productCode}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const batchId = generateBatchId();
    const record: FarmerRecord = {
      batchId,
      farmerId,
      productName,
      quantityValue,
      quantityUnit,
      harvestedDateISO: harvestedDate ? new Date(harvestedDate).toISOString() : new Date().toISOString(),
      state: stateCode,
      district,
      villageTown,
      latitude: latitude ? Number(latitude) : 0,
      longitude: longitude ? Number(longitude) : 0,
      addedBy,
      createdAtISO,
    };

    try {
      // ✅ call central API
      await addFarmerBatch({
        batchId,
        farmerId,
        productName,
        quantity: `${quantityValue}${quantityUnit}`,
        location: `${villageTown}, ${district}, ${stateCode}`,
        harvestedDate,
        coordinates: { latitude: Number(latitude), longitude: Number(longitude) },
        addedBy,
      });

      onSubmitRecord(record);
      setConfirmation(batchId);
    } catch (error) {
      console.error('Error adding to ledger:', error);
      alert('Failed to save to ledger. Please try again.');
    }
  }

  return (
    <div className="mx-auto w-full">
      {!confirmation ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium">Product</label>
              <select value={productName} onChange={(e) => setProductName(e.target.value as Herb)} className="w-full border border-gray-300 rounded px-3 py-2">
                {herbList.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block mb-1 font-medium">Quantity</label>
                <input type="number" min="0" value={quantityValue} onChange={(e) => setQuantityValue(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Unit</label>
                <select value={quantityUnit} onChange={(e) => setQuantityUnit(e.target.value as QuantityUnit)} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="Kg">Kg</option>
                  <option value="Ton">Ton</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Harvested Date</label>
              <input type="date" value={harvestedDate} onChange={(e) => setHarvestedDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-medium">State</label>
                <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                  {stateOptions.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">District</label>
                <input value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Village/Town</label>
                <input value={villageTown} onChange={(e) => setVillageTown(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block mb-1 font-medium">Latitude</label>
                <input value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Longitude</label>
                <input value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Added By</label>
              <input value={addedBy} onChange={(e) => setAddedBy(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>Created At: {createdAtDisplay}</div>
            <button type="submit" className="text-white px-4 py-2 rounded" style={{ backgroundImage: 'linear-gradient(90deg, #76b852, #8dc26f)' }}>
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded border border-green-300 bg-green-50 p-4">
          <div className="font-semibold text-green-800">Submitted successfully</div>
          <div className="text-green-700 text-sm">Batch ID: {confirmation}</div>
        </div>
      )}
    </div>
  );
}
