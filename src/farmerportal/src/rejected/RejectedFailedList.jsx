import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, XCircle, AlertTriangle, Package, Calendar, FileText, CheckCircle, Download } from 'lucide-react';

const RejectedFailedList = ({ onBack, onViewDetails, t, farmerId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const downloadPDF = (batch, event) => {
    event.stopPropagation(); // Prevent card click
    
    if (!batch.pdfReport) {
      alert('PDF report not available for this batch');
      return;
    }
    
    try {
      // Convert base64 to blob
      const base64Data = batch.pdfReport.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = batch.pdfFilename || `LAB_REPORT_${batch.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF report');
    }
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const resp = await fetch('http://localhost:3001/events');
        if (!resp.ok) throw new Error('Failed to fetch');
        const ledgerData = await resp.json();

        // Build batch info by grouping events
        const batchMap = new Map();
        for (const ev of ledgerData) {
          const existing = batchMap.get(ev.batchId) || {};
          if (ev.stage === 'farmer') existing.farmer = existing.farmer ?? ev;
          if (ev.stage === 'lab') existing.lab = existing.lab ?? ev;
          batchMap.set(ev.batchId, existing);
        }

        // Filter for rejected batches belonging to this farmer
        const fid = farmerId || 'FARM001';
        const rejectedBatches = [];

        for (const [batchId, info] of batchMap.entries()) {
          if (!info.farmer || !info.lab) continue;

          const farmerData = info.farmer.data || {};
          const labData = info.lab.data || {};

          // Check if this batch belongs to the farmer
          const isFarmerBatch = 
            String(info.farmer.addedBy || '').includes(fid) ||
            String(farmerData.farmerId || '').includes(fid);

          if (!isFarmerBatch) continue;

          // Check if rejected (new approvalStatus field or old grade check)
          const isRejected = 
            labData.approvalStatus === 'rejected' ||
            labData.qualityGrade === 'F' ||
            labData.qualityGrade === 'Rejected';

          if (isRejected) {
            rejectedBatches.push({
              batchId,
              farmer: info.farmer,
              lab: info.lab,
              farmerData,
              labData
            });
          }
        }

        // Transform to display format
        const transformedBatches = rejectedBatches.map(batch => {
          const { batchId, farmerData, labData, lab } = batch;
          const originalGrade = labData.originalGrade || labData.qualityGrade;
          const rejectionReason = getRejectionReason(labData);

          return {
            id: batchId,
            productName: farmerData.productName || 'Unknown',
            rejectedDate: new Date(lab.timestamp).toLocaleDateString('en-GB'),
            reason: rejectionReason,
            rejectedBy: labData.testedBy || 'Lab QC',
            type: originalGrade === 'F' ? 'Failed' : 'Rejected',
            typeColor: 'bg-red-100 text-red-700',
            grade: originalGrade,
            approvalDecision: labData.approvalDecision,
            pdfReport: labData.pdfReport,
            pdfFilename: labData.pdfFilename
          };
        });

        setBatches(transformedBatches);
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, [farmerId]);

  // Helper function to determine rejection reason
  const getRejectionReason = (labData) => {
    // Check for critical failures
    if (labData.heavyMetals === 'Fail') {
      return 'Heavy metals test failed - Critical safety concern';
    }
    if (labData.ecoli === 'Present' || labData.ecoliSalmonella === 'Present') {
      return 'E.coli/Salmonella detected - Microbial contamination';
    }
    if (parseFloat(labData.aflatoxin) > 5) {
      return 'Aflatoxin levels exceed safety limits (>5 ppb)';
    }
    if (parseFloat(labData.pesticide) > 0.1) {
      return 'Pesticide residue exceeds acceptable limits (>0.1 ppm)';
    }
    
    // Check approval decision
    if (labData.approvalDecision === 'reject') {
      return 'Rejected by lab technician after manual review (Grade C)';
    }
    if (labData.approvalDecision === 'auto_rejected') {
      return 'Automatically rejected due to poor quality grade (Grade F)';
    }

    // Generic rejection
    return labData.remarks || 'Failed to meet quality standards';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-4 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-red-600 rounded-xl">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Rejected / Failed Batches</h1>
            <p className="text-gray-600">Batches that were rejected or failed quality checks</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">Loading rejected batches...</div>
        ) : batches.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>Great! No rejected batches</p>
          </div>
        ) : null}
        {batches.map((batch, index) => (
          <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }} onClick={() => onViewDetails(batch.id)} className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-red-500">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{batch.id}</h3>
                <p className="text-sm text-gray-600">{batch.productName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${batch.typeColor}`}>
                {batch.type}
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 mb-1">Reason</p>
                <p className="text-sm font-semibold text-red-800">{batch.reason}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rejected Date:</span>
                <span className="font-semibold text-gray-800">{batch.rejectedDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Rejected By:</span>
                <span className="font-semibold text-gray-800 text-right">{batch.rejectedBy}</span>
              </div>
              {batch.pdfReport && (
                <button
                  onClick={(e) => downloadPDF(batch, e)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Test Report (PDF)
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RejectedFailedList;
