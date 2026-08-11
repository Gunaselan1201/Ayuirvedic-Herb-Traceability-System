import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReportsAnalyticsProps {
  batches: any[];
}

export function ReportsAnalytics({ batches }: ReportsAnalyticsProps) {
  const stats = {
    totalTests: batches.filter(b => b.status === 'TESTED').length,
    pendingTests: batches.filter(b => b.status === 'PENDING').length,
    passRate: 100,
    avgTestTime: '15 minutes',
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo color
    doc.text('Lab Portal - Reports & Analytics', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 28, { align: 'center' });
    
    // Stats Section
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Key Metrics Summary', 20, 45);
    
    doc.setFontSize(11);
    doc.setTextColor(60);
    
    let yPos = 55;
    doc.text(`Total Tests Completed: ${stats.totalTests}`, 25, yPos);
    yPos += 10;
    doc.text(`Pending Tests: ${stats.pendingTests}`, 25, yPos);
    yPos += 10;
    doc.text(`Pass Rate: ${stats.passRate}%`, 25, yPos);
    yPos += 10;
    doc.text(`Average Test Duration: ${stats.avgTestTime}`, 25, yPos);
    
    // Recent Activity Section
    yPos += 20;
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Recent Test Activity', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(60);
    
    const testedBatches = batches.filter(b => b.status === 'TESTED').slice(0, 10);
    
    if (testedBatches.length === 0) {
      yPos += 10;
      doc.text('No test results available yet', 25, yPos);
    } else {
      // Table headers
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Batch ID', 25, yPos);
      doc.text('Product Name', 70, yPos);
      doc.text('Grade', 130, yPos);
      doc.text('Status', 160, yPos);
      
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      
      testedBatches.forEach((batch, index) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(batch.id || 'N/A', 25, yPos);
        doc.text(batch.productName || 'N/A', 70, yPos);
        doc.text(batch.grade || 'N/A', 130, yPos);
        doc.text('Passed', 160, yPos);
        
        yPos += 8;
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Lab Portal Analytics Report - Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('© 2024 AyurChain Lab Portal', 105, 285, { align: 'center' });
    }
    
    // Save PDF
    doc.save(`Lab_Reports_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-7xl mx-auto'
      >
        {/* Header */}
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center'>
                <PieChart className='w-7 h-7 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>Reports & Analytics</h1>
                <p className='text-gray-600 text-sm'>Visual insights into lab operations</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-md transition-colors'
            >
              <Download className='w-5 h-5' />
              Export Report
            </motion.button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className='grid grid-cols-4 gap-4 mb-6'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-white rounded-xl shadow-lg p-5 border border-gray-100'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-green-600' />
              </div>
              <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold'>
                +12%
              </span>
            </div>
            <p className='text-gray-600 text-sm mb-1'>Total Tests</p>
            <p className='text-3xl font-bold text-gray-900'>{stats.totalTests}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-white rounded-xl shadow-lg p-5 border border-gray-100'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-orange-600' />
              </div>
              <span className='text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold'>
                Active
              </span>
            </div>
            <p className='text-gray-600 text-sm mb-1'>Pending</p>
            <p className='text-3xl font-bold text-gray-900'>{stats.pendingTests}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-white rounded-xl shadow-lg p-5 border border-gray-100'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center'>
                <BarChart3 className='w-6 h-6 text-blue-600' />
              </div>
              <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold'>
                Excellent
              </span>
            </div>
            <p className='text-gray-600 text-sm mb-1'>Pass Rate</p>
            <p className='text-3xl font-bold text-gray-900'>{stats.passRate}%</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className='bg-white rounded-xl shadow-lg p-5 border border-gray-100'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center'>
                <PieChart className='w-6 h-6 text-purple-600' />
              </div>
              <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold'>
                Avg
              </span>
            </div>
            <p className='text-gray-600 text-sm mb-1'>Test Duration</p>
            <p className='text-2xl font-bold text-gray-900'>{stats.avgTestTime}</p>
          </motion.div>
        </div>

        {/* Charts Placeholder */}
        <div className='grid grid-cols-2 gap-6'>
          {/* Chart 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'
          >
            <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <BarChart3 className='w-5 h-5 text-indigo-600' />
              Monthly Testing Trends
            </h3>
            <div className='h-64 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100'>
              <div className='text-center'>
                <BarChart3 className='w-16 h-16 text-indigo-300 mx-auto mb-3' />
                <p className='text-gray-500 font-semibold'>Chart Coming Soon</p>
                <p className='text-gray-400 text-sm'>Install Recharts/Chart.js</p>
              </div>
            </div>
          </motion.div>

          {/* Chart 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100'
          >
            <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
              <PieChart className='w-5 h-5 text-purple-600' />
              Pass/Fail Distribution
            </h3>
            <div className='h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100'>
              <div className='text-center'>
                <PieChart className='w-16 h-16 text-purple-300 mx-auto mb-3' />
                <p className='text-gray-500 font-semibold'>Chart Coming Soon</p>
                <p className='text-gray-400 text-sm'>Pie chart visualization</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6'
        >
          <h3 className='text-lg font-bold text-gray-900 mb-4'>Recent Test Activity</h3>
          {batches.filter(b => b.status === 'TESTED').length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No test results yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {batches.filter(b => b.status === 'TESTED').slice(0, 5).map((batch, index) => (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors'
                >
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center'>
                      <TrendingUp className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <p className='font-semibold text-gray-900'>{batch.id}</p>
                      <p className='text-sm text-gray-600'>{batch.productName}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className='text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold'>
                      Passed
                    </span>
                    <p className='text-xs text-gray-500 mt-1'>Tested by: {batch.addedBy || 'Lab Team'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
