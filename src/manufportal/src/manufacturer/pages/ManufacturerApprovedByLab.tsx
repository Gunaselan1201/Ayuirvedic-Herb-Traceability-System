import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Calendar, Package, User, Beaker, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApprovedBatch {
  id: string;
  productName: string;
  approvedDate: string;
  grade: string;
  quantity: string;
  farmerName: string;
  labName: string;
  gradeColor: string;
  gradeBg: string;
}

export function ManufacturerApprovedByLab() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<ApprovedBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, gradeA: 0, gradeB: 0, gradeC: 0 });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const resp = await fetch('http://localhost:3001/events');
        if (!resp.ok) throw new Error('Failed to fetch');
        const ledgerData = await resp.json();

        const batchMap = new Map();
        for (const event of ledgerData) {
          const existing = batchMap.get(event.batchId) || {};
          if (event.stage === 'farmer') existing.farmer = existing.farmer ?? event;
          if (event.stage === 'lab') existing.lab = existing.lab ?? event;
          if (event.stage === 'manufacturer') existing.manufacturer = existing.manufacturer ?? event;
          batchMap.set(event.batchId, existing);
        }

        const approvedBatches: ApprovedBatch[] = [];
        let gradeACount = 0, gradeBCount = 0, gradeCCount = 0;

        for (const [batchId, stages] of batchMap.entries()) {
          const { farmer, lab, manufacturer } = stages;
          
          if (lab && lab.data?.qualityGrade && ['A', 'B', 'C'].includes(lab.data.qualityGrade) && !manufacturer) {
            const grade = lab.data.qualityGrade;
            if (grade === 'A') gradeACount++;
            else if (grade === 'B') gradeBCount++;
            else if (grade === 'C') gradeCCount++;

            const gradeColors: any = {
              'A': { color: 'text-green-700', bg: 'bg-green-100' },
              'B': { color: 'text-blue-700', bg: 'bg-blue-100' },
              'C': { color: 'text-amber-700', bg: 'bg-amber-100' }
            };

            approvedBatches.push({
              id: batchId,
              productName: farmer?.data?.productName || 'Unknown',
              approvedDate: new Date(lab.timestamp).toLocaleDateString('en-GB'),
              grade,
              quantity: `${farmer?.data?.quantityValue || '0'} ${farmer?.data?.quantityUnit || 'Kg'}`,
              farmerName: farmer?.data?.farmerName || 'Unknown Farmer',
              labName: lab?.data?.labTechnicianName || 'Lab Technician',
              gradeColor: gradeColors[grade]?.color || 'text-gray-700',
              gradeBg: gradeColors[grade]?.bg || 'bg-gray-100',
            });
          }
        }

        approvedBatches.sort((a, b) => 
          new Date(b.approvedDate.split('/').reverse().join('-')).getTime() - 
          new Date(a.approvedDate.split('/').reverse().join('-')).getTime()
        );

        setBatches(approvedBatches);
        setStats({ total: approvedBatches.length, gradeA: gradeACount, gradeB: gradeBCount, gradeC: gradeCCount });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
    const interval = setInterval(fetchBatches, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-6'>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-6'>
          <motion.button
          whileHover={{ x: -4 }}
          onClick={() => navigate('/dashboard')}
          className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors'
          aria-label='Back to dashboard'
          title='Back to dashboard'
        >
          <ArrowLeft className='w-5 h-5' />
          <span className='font-medium'>Back to Dashboard</span>
        </motion.button>

        <div className='flex items-center gap-3 mb-2'>
          <div className='p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl'>
            <Award className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Approved by Lab</h1>
            <p className='text-gray-600'>Batches ready for production</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        {[
          { label: 'Total Approved', value: stats.total, color: 'blue', icon: Award },
          { label: 'Grade A', value: stats.gradeA, color: 'green', icon: Award },
          { label: 'Grade B', value: stats.gradeB, color: 'blue', icon: Award },
          { label: 'Grade C', value: stats.gradeC, color: 'amber', icon: Award }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white rounded-xl p-6 shadow-lg border-l-4 border-${stat.color}-500`}
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>{stat.label}</p>
                <h3 className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</h3>
              </div>
              <stat.icon className={`w-12 h-12 text-${stat.color}-500`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Batches Grid */}
      {loading ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center'>
          <Award className='w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>Loading...</h2>
        </div>
      ) : batches.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-lg p-16 text-center'>
          <Award className='w-16 h-16 text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>No Approved Batches</h2>
          <p className='text-gray-600 text-lg'>Lab-approved batches will appear here</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {batches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className='bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-500'
            >
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h3 className='text-lg font-bold text-gray-800'>{batch.id}</h3>
                  <p className='text-sm text-gray-500'>{batch.productName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${batch.gradeBg} ${batch.gradeColor}`}>
                  Grade {batch.grade}
                </span>
              </div>

              <div className='space-y-2 mb-4'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Package className='w-4 h-4' />
                  <span>{batch.quantity}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <User className='w-4 h-4' />
                  <span>{batch.farmerName}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Beaker className='w-4 h-4' />
                  <span>{batch.labName}</span>
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <Calendar className='w-4 h-4' />
                  <span>Approved: {batch.approvedDate}</span>
                </div>
              </div>

              <div className='pt-3 border-t border-gray-200'>
                <span className='inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium'>
                  Ready for Production
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
