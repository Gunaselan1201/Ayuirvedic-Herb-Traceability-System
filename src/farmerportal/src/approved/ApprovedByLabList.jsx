import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Package, Calendar, Award, TrendingUp, Star, Download } from 'lucide-react';

const ApprovedByLabList = ({ onBack, onViewDetails, t, farmerId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });

  const downloadPDF = (batch) => {
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

        // Build batch info by batchId
        const batchMap = new Map();
        for (const ev of ledgerData) {
          const existing = batchMap.get(ev.batchId) || {};
          if (ev.stage === 'farmer') existing.farmer = existing.farmer ?? ev;
          if (ev.stage === 'lab') existing.lab = existing.lab ?? ev;
          batchMap.set(ev.batchId, existing);
        }

        // Filter for batches with lab stage and approved status
        const fid = farmerId || 'F-00123';
        const approvedBatches = [];
        
        for (const [batchId, info] of batchMap.entries()) {
          if (!info.farmer || !info.lab) continue;
          
          const farmerData = info.farmer.data || {};
          const labData = info.lab.data || {};
          
          // Check if this batch belongs to the farmer
          const isFarmerBatch = 
            String(info.farmer.addedBy || '').includes(fid) ||
            String(farmerData.farmerId || '').includes(fid);
          
          if (!isFarmerBatch) continue;
          
          // Check if approved (not rejected)
          const isApproved = labData.approvalStatus !== 'rejected' && 
                            labData.qualityGrade !== 'F' && 
                            labData.qualityGrade !== 'Rejected';
          
          if (isApproved) {
            approvedBatches.push({
              batchId,
              farmer: info.farmer,
              lab: info.lab,
              farmerData,
              labData
            });
          }
        }

        // Transform to display format
        const transformedBatches = approvedBatches.map(batch => {
          const { batchId, farmerData, labData, lab } = batch;
          const grade = labData.originalGrade || labData.qualityGrade || 'N/A';
          const isGradeA = grade === 'A';
          const isGradeB = grade === 'B';
          const isGradeC = grade === 'C';
          
          return {
            id: batchId,
            productName: farmerData.productName || 'Unknown',
            approvalDate: new Date(lab.timestamp).toLocaleDateString('en-GB'),
            grade: grade,
            testStatus: 'Completed',
            gradeColor: isGradeA ? 'text-green-600' : isGradeB ? 'text-blue-600' : 'text-orange-600',
            gradeBg: isGradeA ? 'bg-green-50' : isGradeB ? 'bg-blue-50' : 'bg-orange-50',
            quantity: farmerData.quantity || 'N/A',
            testedBy: labData.testedBy || 'Lab',
            testDate: labData.testDate || new Date(lab.timestamp).toLocaleDateString('en-GB'),
            pdfReport: labData.pdfReport,
            pdfFilename: labData.pdfFilename,
            approvalDecision: labData.approvalDecision
          };
        });

        // Calculate stats
        const gradeACount = transformedBatches.filter(b => b.grade === 'A').length;
        const gradeBCount = transformedBatches.filter(b => b.grade === 'B').length;
        const gradeCCount = transformedBatches.filter(b => b.grade === 'C').length;

        setBatches(transformedBatches);
        setStats({
          total: transformedBatches.length,
          gradeA: gradeACount,
          gradeB: gradeBCount,
          gradeC: gradeCCount
        });
      } catch (error) {
        console.error('Error fetching batches:', error);
        setBatches([]);
        setStats({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, [farmerId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Approved by Lab</h1>
            <p className="text-gray-600">Batches that passed quality testing</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Total Approved</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Grade A (Excellent)</span>
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.gradeA}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Grade B (Good)</span>
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.gradeB}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-md"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-white" />
            <span className="text-sm text-white">Grade C (Conditional)</span>
          </div>
          <p className="text-2xl font-bold text-white">{loading ? '...' : stats.gradeC}</p>
        </motion.div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-gray-500">Loading approved batches...</div>
        ) : batches.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">No approved batches yet</div>
        ) : null}
        {batches.map((batch, index) => (
          <motion.div
            key={batch.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => onViewDetails(batch.id)}
            className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-green-500"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{batch.id}</h3>
                <p className="text-sm text-gray-600">{batch.productName}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg ${batch.gradeBg} ${batch.gradeColor} font-bold text-xl`}>
                {batch.grade}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Test Date:</span>
                <span className="font-semibold text-gray-800">{batch.testDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tested By:</span>
                <span className="font-semibold text-gray-800">{batch.testedBy}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold text-gray-800">{batch.quantity}</span>
              </div>
              {batch.approvalDecision && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Decision:</span>
                  <span className={`font-semibold ${
                    batch.approvalDecision === 'approve' ? 'text-green-600' : 
                    batch.approvalDecision === 'auto_approved' ? 'text-blue-600' :
                    'text-gray-600'
                  }`}>
                    {batch.approvalDecision === 'approve' ? 'Manually Approved' : 
                     batch.approvalDecision === 'auto_approved' ? 'Auto Approved' :
                     batch.approvalDecision.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex gap-2">
              {batch.pdfReport && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadPDF(batch);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              )}
              {!batch.pdfReport && (
                <div className="flex-1 text-center text-gray-400 text-sm py-2">
                  PDF report not available
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedByLabList;
