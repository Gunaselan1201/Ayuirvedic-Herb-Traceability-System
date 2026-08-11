import type { LabBatch, LedgerEvent } from '../../../../types';
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FlaskConical, Save } from 'lucide-react';

export function LabForm({ batches, onSubmit }: { batches: LabBatch[]; onSubmit: (id: string, update: any) => void }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const batch = useMemo(() => batches.find(b => b.id === id), [batches, id]);
  const [form, setForm] = useState({
    moisturePercent: 0,
    pesticideLevelPpm: 0,
    pesticideResidues: '',
    heavyMetalsPb: '',
    heavyMetalsAs: '',
    heavyMetalsCd: '',
    heavyMetalsHg: '',
    microbialLoad: '',
    aflatoxins: '',
    moistureWaterActivity: '',
    macroMicroIdentity: '',
    totalAsh: '',
    extractiveValues: '',
    foreignOrganicMatter: '',
    tlcHptlc: '',
    markerCompoundQuant: '',
    residualSolvents: '',
    pesticidePanelConfirmation: '',
    dnaBarcoding: '',
    qualityGrade: 'A',
    testedby: '',
    addedBy: '',
    testedAtIso: new Date().toISOString(),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!batch) return;
    // Append lab event to ledger
    const event: LedgerEvent = {
      batchId: batch.id,
      stage: 'lab',
      addedBy: form.addedBy || form.testedby || 'Lab User',
      data: {
        moisture: form.moisturePercent,
        pesticide: form.pesticideLevelPpm,
        quality: form.qualityGrade,
        pesticideResidues: form.pesticideResidues,
        heavyMetals: { Pb: form.heavyMetalsPb, As: form.heavyMetalsAs, Cd: form.heavyMetalsCd, Hg: form.heavyMetalsHg },
        microbialLoad: form.microbialLoad,
        aflatoxins: form.aflatoxins,
        moistureWaterActivity: form.moistureWaterActivity,
        macroMicroIdentity: form.macroMicroIdentity,
        totalAsh: form.totalAsh,
        extractiveValues: form.extractiveValues,
        foreignOrganicMatter: form.foreignOrganicMatter,
        tlcHptlc: form.tlcHptlc,
        markerCompoundQuant: form.markerCompoundQuant,
        residualSolvents: form.residualSolvents,
        pesticidePanelConfirmation: form.pesticidePanelConfirmation,
        dnaBarcoding: form.dnaBarcoding,
        testedBy: form.testedby,
        testedAtISO: form.testedAtIso,
      },
    } as any;
    fetch('http://localhost:3001/add-event', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event)
    }).finally(() => onSubmit(batch.id, {
      ...form,
      testedBy: form.testedby,
    }));
  }

  if (!batch) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Invalid batch. Go back and select a pending batch.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/lab/dashboard')}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FlaskConical className="w-8 h-8 text-blue-600" />
              Lab Testing Form
            </h1>
            <p className="text-gray-600 mt-1">Batch ID: {batch.id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Batch Info Section */}
        <motion.fieldset
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg"
        >
          <legend className="px-3 py-1 text-sm font-bold text-blue-700 bg-blue-50 rounded-lg border border-blue-200">Batch Info</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Batch ID</label>
              <input value={batch.id} disabled className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 font-medium" />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Product Name</label>
              <input value={batch.productName} disabled className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-700 font-medium" />
            </div>
          </div>
        </motion.fieldset>

        {/* Numeric Tests */}
        <motion.fieldset
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-lg"
        >
          <legend className="px-3 py-1 text-sm font-bold text-green-700 bg-green-50 rounded-lg border border-green-200">Numeric Tests</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Moisture %</label>
              <input type="number" value={form.moisturePercent} onChange={(e) => setForm({ ...form, moisturePercent: Number(e.target.value) })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Pesticide ppm</label>
              <input type="number" value={form.pesticideLevelPpm} onChange={(e) => setForm({ ...form, pesticideLevelPpm: Number(e.target.value) })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none" />
            </div>
          </div>
        </motion.fieldset>

        {/* Core Tests */}
        <motion.fieldset
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-lg"
        >
          <legend className="px-3 py-1 text-sm font-bold text-purple-700 bg-purple-50 rounded-lg border border-purple-200">Core Tests</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Pesticide Residues</label>
              <input value={form.pesticideResidues} onChange={(e) => setForm({ ...form, pesticideResidues: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Microbial Load</label>
              <input value={form.microbialLoad} onChange={(e) => setForm({ ...form, microbialLoad: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Aflatoxins</label>
              <input value={form.aflatoxins} onChange={(e) => setForm({ ...form, aflatoxins: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Moisture Water Activity</label>
              <input value={form.moistureWaterActivity} onChange={(e) => setForm({ ...form, moistureWaterActivity: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 font-semibold text-gray-800">Heavy Metals (Pb, As, Cd, Hg)</label>
              <div className="grid grid-cols-4 gap-3">
                <input placeholder="Pb" value={form.heavyMetalsPb} onChange={(e) => setForm({ ...form, heavyMetalsPb: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
                <input placeholder="As" value={form.heavyMetalsAs} onChange={(e) => setForm({ ...form, heavyMetalsAs: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
                <input placeholder="Cd" value={form.heavyMetalsCd} onChange={(e) => setForm({ ...form, heavyMetalsCd: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
                <input placeholder="Hg" value={form.heavyMetalsHg} onChange={(e) => setForm({ ...form, heavyMetalsHg: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none" />
              </div>
            </div>
          </div>
        </motion.fieldset>

        {/* Ayurvedic Tests */}
        <motion.fieldset
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-lg"
        >
          <legend className="px-3 py-1 text-sm font-bold text-amber-700 bg-amber-50 rounded-lg border border-amber-200">Ayurvedic Pharmacopoeial Quality Tests</legend>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Macro/Micro Identity" value={form.macroMicroIdentity} onChange={(e) => setForm({ ...form, macroMicroIdentity: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" />
            <input placeholder="Total Ash (total / acid-insoluble)" value={form.totalAsh} onChange={(e) => setForm({ ...form, totalAsh: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" />
            <input placeholder="Extractive Values" value={form.extractiveValues} onChange={(e) => setForm({ ...form, extractiveValues: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" />
            <input placeholder="Foreign Organic Matter" value={form.foreignOrganicMatter} onChange={(e) => setForm({ ...form, foreignOrganicMatter: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" />
            <input placeholder="TLC / HPTLC Fingerprint" value={form.tlcHptlc} onChange={(e) => setForm({ ...form, tlcHptlc: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" />
            <input placeholder="Marker Compound Quantification" value={form.markerCompoundQuant} onChange={(e) => setForm({ ...form, markerCompoundQuant: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all outline-none" />
          </div>
        </motion.fieldset>

        {/* Export Grade Tests */}
        <motion.fieldset
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border-2 border-cyan-200 rounded-xl p-6 shadow-lg"
        >
          <legend className="px-3 py-1 text-sm font-bold text-cyan-700 bg-cyan-50 rounded-lg border border-cyan-200">Export-Grade Tests</legend>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Residual Solvents" value={form.residualSolvents} onChange={(e) => setForm({ ...form, residualSolvents: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all outline-none" />
            <input placeholder="Pesticide Panel Confirmation" value={form.pesticidePanelConfirmation} onChange={(e) => setForm({ ...form, pesticidePanelConfirmation: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all outline-none" />
            <input placeholder="DNA Barcoding" value={form.dnaBarcoding} onChange={(e) => setForm({ ...form, dnaBarcoding: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all outline-none" />
          </div>
        </motion.fieldset>

        {/* Final Details */}
        <motion.fieldset
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-lg"
        >
          <legend className="px-3 py-1 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-lg border border-indigo-200">Final Details</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Quality Grade</label>
              <select value={form.qualityGrade} onChange={(e) => setForm({ ...form, qualityGrade: e.target.value as any })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none">
                <option value="A">A - Excellent</option>
                <option value="B">B - Good</option>
                <option value="C">C - Fair</option>
                <option value="F">F - Failed</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Tested By</label>
              <input value={form.testedby} onChange={(e) => setForm({ ...form, testedby: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Added By</label>
              <input value={form.addedBy} onChange={(e) => setForm({ ...form, addedBy: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Tested At (ISO)</label>
              <input value={form.testedAtIso} onChange={(e) => setForm({ ...form, testedAtIso: e.target.value })} className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-800">Date & Time</label>
              <input value={new Date().toLocaleString()} disabled className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full bg-gray-50 text-gray-700" />
            </div>
          </div>
        </motion.fieldset>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <button
            type="button"
            onClick={() => navigate('/lab/dashboard')}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Submit Lab Result
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
}
