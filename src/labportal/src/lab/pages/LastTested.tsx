import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Download, FlaskConical, ArrowLeft } from 'lucide-react';

export function LastTested() {
  const [tests, setTests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTestHistory();
  }, []);

  const fetchTestHistory = async () => {
    try {
      const resp = await fetch('http://localhost:3001/events');
      if (!resp.ok) throw new Error('Failed to fetch');
      const ledgerData = await resp.json();

      // Build batch map to get farmer data (quantity)
      const batchMap = new Map();
      for (const event of ledgerData) {
        const existing = batchMap.get(event.batchId) || {};
        if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
        if (event.stage === 'lab') existing.lab = existing.lab ?? event;
        batchMap.set(event.batchId, existing);
      }

      // Get all lab stage events, sorted by timestamp (most recent first)
      const allTests: any[] = [];
      for (const [batchId, stages] of batchMap.entries()) {
        if (stages.lab) {
          const farmerData = stages.farmer?.data || {};
          const labData = stages.lab.data || {};
          
          allTests.push({
            id: batchId,
            batchId: batchId,
            productName: farmerData.productName || 'Unknown',
            quantity: farmerData.quantity || 'N/A',
            unit: farmerData.unit || '',
            dateTime: stages.lab.timestamp,
            pdfReport: labData.pdfReport || null,
            qualityGrade: labData.qualityGrade || labData.originalGrade || 'N/A',
            approvalStatus: labData.approvalStatus || 'unknown',
            isLastTested: false
          });
        }
      }

      // Sort by timestamp (most recent first)
      allTests.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      
      // Mark the first one as last tested
      if (allTests.length > 0) {
        allTests[0].isLastTested = true;
      }
      
      setTests(allTests);
    } catch (error) {
      console.error('Error fetching test history:', error);
      setTests([]);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.batchId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDownloadPDF = (pdfDataUrl: string, batchId: string) => {
    if (pdfDataUrl && pdfDataUrl.startsWith('data:application/pdf')) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `Test_Report_${batchId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (pdfDataUrl) {
      // If it's a URL, open in new tab
      window.open(pdfDataUrl, '_blank');
    } else {
      alert('No PDF report available for this batch');
    }
  };

  const handleExportAll = () => {
    console.log('Exporting all tests...');
    // TODO: Generate PDF/Excel with all tests
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Test History</h1>
                <p className="text-gray-600">All laboratory test records</p>
              </div>
            </div>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportAll}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Export All
          </motion.button>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product or batch ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </motion.div>

        {filteredTests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-500"
          >
            <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No test history available</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredTests.map((test, index) => (
              test.isLastTested ? (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Last Tested
                      </div>
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FlaskConical className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    {test.pdfReport ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadPDF(test.pdfReport, test.batchId)}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </motion.button>
                    ) : (
                      <div className="text-xs text-gray-500 italic">No report available</div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Product Name</p>
                      <p className="font-bold text-gray-800 text-lg">{test.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Batch ID</p>
                      <p className="font-bold text-blue-700 text-lg">{test.batchId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quality Grade</p>
                      <div className={`inline-block px-3 py-1 rounded-lg font-bold text-lg ${
                        test.qualityGrade === 'A' || test.qualityGrade === 'Approved' 
                          ? 'bg-green-100 text-green-700 border-2 border-green-400' 
                          : test.qualityGrade === 'B' 
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' 
                          : test.qualityGrade === 'C' 
                          ? 'bg-orange-100 text-orange-700 border-2 border-orange-400' 
                          : test.qualityGrade === 'F' || test.qualityGrade === 'Rejected' 
                          ? 'bg-red-100 text-red-700 border-2 border-red-400' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {test.qualityGrade}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="font-semibold text-gray-800">{test.quantity} {test.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(test.dateTime).toLocaleDateString('en-GB')}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(test.dateTime).toLocaleTimeString('en-GB')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <FlaskConical className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Product Name</p>
                        <p className="font-semibold text-gray-800">{test.productName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Batch ID</p>
                        <p className="font-semibold text-gray-800">{test.batchId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Quality Grade</p>
                        <div className={`inline-block px-2 py-1 rounded-md font-bold text-sm ${
                          test.qualityGrade === 'A' || test.qualityGrade === 'Approved' 
                            ? 'bg-green-100 text-green-700 border border-green-400' 
                            : test.qualityGrade === 'B' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-400' 
                            : test.qualityGrade === 'C' 
                            ? 'bg-orange-100 text-orange-700 border border-orange-400' 
                            : test.qualityGrade === 'F' || test.qualityGrade === 'Rejected' 
                            ? 'bg-red-100 text-red-700 border border-red-400' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {test.qualityGrade}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Quantity</p>
                        <p className="font-semibold text-gray-800">{test.quantity} {test.unit}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Date & Time</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(test.dateTime).toLocaleDateString('en-GB')}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(test.dateTime).toLocaleTimeString('en-GB')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {test.pdfReport ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadPDF(test.pdfReport, test.batchId)}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </motion.button>
                  ) : (
                    <div className="ml-4 text-xs text-gray-500 italic px-4 py-2">No report</div>
                  )}
                </div>
              </motion.div>
              )
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
