import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, FlaskConical, Save, CheckCircle, AlertCircle, XCircle,
  Droplet, Beaker, Bug, Dna, FileText, Calendar, User 
} from 'lucide-react';
import type { LabBatch } from '../../../../types';
import jsPDF from 'jspdf';

interface BatchTestingFormProps {
  batches: LabBatch[];
  onSubmit: (id: string, update: any) => void;
  labTechnicianName?: string;
}

export function BatchTestingForm({ batches, onSubmit, labTechnicianName = 'Dr. Rajesh Kumar' }: BatchTestingFormProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState<LabBatch | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load batch data from blockchain or props
  useEffect(() => {
    const loadBatch = async () => {
      // First try to find in props
      let foundBatch = batches.find(b => b.id === id);
      
      // If not in props, fetch from blockchain
      if (!foundBatch && id) {
        try {
          const res = await fetch('http://localhost:3001/events');
          const allEvents = await res.json();
          
          // Find farmer event for this batch
          const farmerEvent = allEvents.find((e: any) => e.batchId === id && e.stage === 'farmer');
          if (farmerEvent) {
            const data = farmerEvent.data || {};
            foundBatch = {
              id: id,
              productName: data.productName || 'Unknown Product',
              farmerName: data.farmerId || farmerEvent.addedBy || 'Unknown Farmer',
              collectionDate: data.harvestedDate || farmerEvent.timestamp || new Date().toISOString(),
              status: 'PENDING',
              addedBy: farmerEvent.addedBy
            };
          }
        } catch (error) {
          console.error('Error loading batch:', error);
        }
      }
      
      setBatchData(foundBatch || null);
      setLoading(false);
    };
    
    loadBatch();
  }, [id, batches]);
  
  const batch = batchData;

  const [form, setForm] = useState({
    // Physical Tests
    moistureContent: '',
    ashValue: '',
    foreignMatter: '',
    
    // Chemical Tests
    phLevel: '',
    pesticideResidue: '',
    heavyMetals: 'Pass',
    solventResidue: 'Pass',
    phytochemicalScreening: 'Pass',
    
    // Biological Tests
    microbialTest: 'Pass',
    fungalCount: '',
    ecoliSalmonella: 'Absent',
    aflatoxinTest: '',
    
    // Authentication
    dnaVerification: false,
    ftirFingerprint: 'Pass',
    
    // Summary
    qualityGrade: 'A',
    testedBy: labTechnicianName,
    testDate: new Date().toISOString().split('T')[0],
    testTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    remarks: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAlreadyTested, setIsAlreadyTested] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'approve' | 'reject' | null>(null);
  
  // Auto-calculate quality grade based on test parameters
  const calculateQualityGrade = () => {
    const moisture = parseFloat(form.moistureContent);
    const ash = parseFloat(form.ashValue);
    const foreign = parseFloat(form.foreignMatter);
    const ph = parseFloat(form.phLevel);
    const pesticide = parseFloat(form.pesticideResidue);
    const fungal = parseFloat(form.fungalCount);
    const aflatoxin = parseFloat(form.aflatoxinTest);

    let gradePoints = 0;
    let criticalFailures = 0;

    // Critical failures (auto Poor grade)
    if (form.heavyMetals === 'Fail') criticalFailures++;
    if (form.ecoliSalmonella === 'Present') criticalFailures++;
    if (aflatoxin > 5) criticalFailures++;
    if (pesticide > 0.1) criticalFailures++;

    if (criticalFailures > 0) {
      return 'F'; // Poor/Failed
    }

    // Grade A criteria (all within ideal range)
    if (moisture >= 5 && moisture <= 12) gradePoints++;
    if (ash >= 1 && ash <= 5) gradePoints++;
    if (foreign <= 2) gradePoints++;
    if (ph >= 5.5 && ph <= 7.5) gradePoints++;
    if (pesticide <= 0.05) gradePoints++;
    if (fungal < 1000) gradePoints++;
    if (aflatoxin < 2) gradePoints++;
    if (form.microbialTest === 'Pass') gradePoints++;
    if (form.solventResidue === 'Pass') gradePoints++;
    if (form.phytochemicalScreening === 'Pass') gradePoints++;
    if (form.ftirFingerprint === 'Pass') gradePoints++;

    // Grading logic
    if (gradePoints >= 10) return 'A'; // Excellent
    if (gradePoints >= 7) return 'B';  // Good
    if (gradePoints >= 5) return 'C';  // Acceptable with conditions
    return 'F'; // Poor
  };

  // Auto-update grade when form values change
  useEffect(() => {
    if (!isAlreadyTested && form.moistureContent && form.ashValue && form.foreignMatter && 
        form.phLevel && form.pesticideResidue && form.fungalCount && form.aflatoxinTest) {
      const calculatedGrade = calculateQualityGrade();
      if (calculatedGrade !== form.qualityGrade) {
        setForm(prev => ({ ...prev, qualityGrade: calculatedGrade }));
      }
    }
  }, [
    form.moistureContent, form.ashValue, form.foreignMatter, form.phLevel,
    form.pesticideResidue, form.fungalCount, form.aflatoxinTest,
    form.heavyMetals, form.ecoliSalmonella, form.microbialTest,
    form.solventResidue, form.phytochemicalScreening, form.ftirFingerprint,
    isAlreadyTested
  ]);
  
  // Check if batch is already tested
  useEffect(() => {
    const checkIfTested = async () => {
      if (!id) return;
      try {
        const res = await fetch('http://localhost:3001/events');
        const allEvents = await res.json();
        const labEvent = allEvents.find((e: any) => e.batchId === id && e.stage === 'lab');
        setIsAlreadyTested(!!labEvent);
      } catch (error) {
        console.error('Error checking batch status:', error);
      }
    };
    checkIfTested();
  }, [id]);

  // Validation rules
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Physical Tests
    const moisture = parseFloat(form.moistureContent);
    if (!form.moistureContent || isNaN(moisture)) {
      newErrors.moistureContent = 'Required';
    } else if (moisture < 0 || moisture > 100) {
      newErrors.moistureContent = 'Must be 0-100%';
    } else if (moisture < 5 || moisture > 12) {
      newErrors.moistureContent = 'Recommended: 5-12%';
    }

    const ash = parseFloat(form.ashValue);
    if (!form.ashValue || isNaN(ash)) {
      newErrors.ashValue = 'Required';
    } else if (ash < 0 || ash > 100) {
      newErrors.ashValue = 'Must be 0-100%';
    } else if (ash < 1 || ash > 5) {
      newErrors.ashValue = 'Recommended: 1-5%';
    }

    const foreign = parseFloat(form.foreignMatter);
    if (!form.foreignMatter || isNaN(foreign)) {
      newErrors.foreignMatter = 'Required';
    } else if (foreign < 0 || foreign > 100) {
      newErrors.foreignMatter = 'Must be 0-100%';
    } else if (foreign > 2) {
      newErrors.foreignMatter = 'Should be <2%';
    }

    // Chemical Tests
    const ph = parseFloat(form.phLevel);
    if (!form.phLevel || isNaN(ph)) {
      newErrors.phLevel = 'Required';
    } else if (ph < 0 || ph > 14) {
      newErrors.phLevel = 'Must be 0-14';
    } else if (ph < 5.5 || ph > 7.5) {
      newErrors.phLevel = 'Recommended: 5.5-7.5';
    }

    const pesticide = parseFloat(form.pesticideResidue);
    if (!form.pesticideResidue || isNaN(pesticide)) {
      newErrors.pesticideResidue = 'Required';
    } else if (pesticide < 0) {
      newErrors.pesticideResidue = 'Must be ≥0';
    } else if (pesticide > 0.1) {
      newErrors.pesticideResidue = 'Should be <0.1 ppm';
    }

    // Biological Tests
    const fungal = parseFloat(form.fungalCount);
    if (!form.fungalCount || isNaN(fungal)) {
      newErrors.fungalCount = 'Required';
    } else if (fungal < 0) {
      newErrors.fungalCount = 'Must be ≥0';
    } else if (fungal > 1000) {
      newErrors.fungalCount = 'Should be <10³ CFU/g';
    }

    const aflatoxin = parseFloat(form.aflatoxinTest);
    if (!form.aflatoxinTest || isNaN(aflatoxin)) {
      newErrors.aflatoxinTest = 'Required';
    } else if (aflatoxin < 0) {
      newErrors.aflatoxinTest = 'Must be ≥0';
    } else if (aflatoxin > 5) {
      newErrors.aflatoxinTest = 'Should be <5 µg/kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LAB TEST REPORT', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Ayurvedic Herb Quality Certification', pageWidth / 2, 30, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    let yPos = 50;

    // Batch Information
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Batch Information', 15, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Batch ID: ${batch?.id || 'N/A'}`, 15, yPos);
    yPos += 6;
    doc.text(`Product Name: ${batch?.productName || 'N/A'}`, 15, yPos);
    yPos += 6;
    doc.text(`Farmer: ${batch?.farmerName || 'N/A'}`, 15, yPos);
    yPos += 6;
    doc.text(`Collection Date: ${batch?.collectionDate || 'N/A'}`, 15, yPos);
    yPos += 12;

    // Physical Tests
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.text('Physical Tests', 17, yPos);
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Moisture Content: ${form.moistureContent}%`, 20, yPos);
    yPos += 6;
    doc.text(`Ash Value: ${form.ashValue}%`, 20, yPos);
    yPos += 6;
    doc.text(`Foreign Matter: ${form.foreignMatter}%`, 20, yPos);
    yPos += 12;

    // Chemical Tests
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.text('Chemical Tests', 17, yPos);
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`pH Level: ${form.phLevel}`, 20, yPos);
    yPos += 6;
    doc.text(`Pesticide Residue: ${form.pesticideResidue} ppm`, 20, yPos);
    yPos += 6;
    doc.text(`Heavy Metals (Pb, Cd, As, Hg): ${form.heavyMetals}`, 20, yPos);
    yPos += 6;
    doc.text(`Solvent Residue: ${form.solventResidue}`, 20, yPos);
    yPos += 6;
    doc.text(`Phytochemical Screening: ${form.phytochemicalScreening}`, 20, yPos);
    yPos += 12;

    // Biological Tests
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.text('Biological Tests', 17, yPos);
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Microbial Test: ${form.microbialTest}`, 20, yPos);
    yPos += 6;
    doc.text(`Fungal Count: ${form.fungalCount} CFU/g`, 20, yPos);
    yPos += 6;
    doc.text(`E. coli / Salmonella: ${form.ecoliSalmonella}`, 20, yPos);
    yPos += 6;
    doc.text(`Aflatoxin Test: ${form.aflatoxinTest} µg/kg`, 20, yPos);
    yPos += 12;

    // Authentication
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    doc.text('Authentication', 17, yPos);
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`DNA / Barcode Verification: ${form.dnaVerification ? 'Verified' : 'Not Verified'}`, 20, yPos);
    yPos += 6;
    doc.text(`FTIR / HPTLC Fingerprint: ${form.ftirFingerprint}`, 20, yPos);
    yPos += 12;

    // Quality Grade
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(34, 197, 94); // Green
    doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(`Quality Grade: ${form.qualityGrade}`, pageWidth / 2, yPos + 3, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    yPos += 18;

    // Remarks
    if (form.remarks) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Remarks:', 15, yPos);
      yPos += 6;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const remarks = doc.splitTextToSize(form.remarks, pageWidth - 30);
      doc.text(remarks, 15, yPos);
      yPos += remarks.length * 6 + 6;
    }

    // Footer
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tested By: ${form.testedBy}`, 15, yPos);
    yPos += 6;
    doc.text(`Test Date: ${form.testDate} ${form.testTime}`, 15, yPos);
    yPos += 10;

    // Blockchain verification footer
    doc.setFillColor(229, 231, 235);
    doc.rect(0, doc.internal.pageSize.getHeight() - 20, pageWidth, 20, 'F');
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text('🔗 Blockchain Verified - This report is immutably recorded on the blockchain', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    return doc;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Check if Grade C requires approval decision
    if (form.qualityGrade === 'C' && !approvalDecision) {
      setShowApprovalDialog(true);
      return;
    }

    // Auto-reject Grade F (Poor)
    let finalGrade = form.qualityGrade;
    if (form.qualityGrade === 'F') {
      finalGrade = 'Rejected';
    } else if (form.qualityGrade === 'C' && approvalDecision === 'reject') {
      finalGrade = 'Rejected';
    }

    setIsSubmitting(true);

    try {
      // Generate PDF
      const pdf = generatePDF();
      const pdfBlob = pdf.output('blob');
      const pdfBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(pdfBlob);
      });

      // Prepare blockchain event
      const event = {
        batchId: batch?.id,
        stage: 'lab',
        addedBy: form.testedBy,
        timestamp: new Date().toISOString(),
        data: {
          // Physical
          moisture: parseFloat(form.moistureContent),
          ashValue: parseFloat(form.ashValue),
          foreignMatter: parseFloat(form.foreignMatter),
          
          // Chemical
          pH: parseFloat(form.phLevel),
          pesticide: parseFloat(form.pesticideResidue),
          heavyMetals: form.heavyMetals,
          solventResidue: form.solventResidue,
          phytochemical: form.phytochemicalScreening,
          
          // Biological
          microbial: form.microbialTest,
          fungalCount: parseFloat(form.fungalCount),
          ecoli: form.ecoliSalmonella,
          aflatoxin: parseFloat(form.aflatoxinTest),
          
          // Authentication
          dnaVerification: form.dnaVerification,
          ftirFingerprint: form.ftirFingerprint,
          
          // Summary
          qualityGrade: finalGrade,
          originalGrade: form.qualityGrade,
          approvalStatus: finalGrade === 'Rejected' ? 'rejected' : (form.qualityGrade === 'C' ? 'conditionally_approved' : 'approved'),
          approvalDecision: approvalDecision || (form.qualityGrade === 'F' ? 'auto_rejected' : 'auto_approved'),
          testedBy: form.testedBy,
          testDate: form.testDate,
          testTime: form.testTime,
          remarks: form.remarks,
          
          // PDF Report
          pdfReport: pdfBase64,
          pdfFilename: `LAB_REPORT_${batch?.id}_${Date.now()}.pdf`
        }
      };

      // Submit to blockchain
      const response = await fetch('http://localhost:3001/add-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        throw new Error('Failed to submit to blockchain');
      }

      // Send notification to Farmer Portal about test results
      try {
        const notificationMessage = finalGrade === 'Rejected' 
          ? `Your batch ${batch?.id} (${batch?.productName}) has been REJECTED. Grade: ${form.qualityGrade}. ${form.remarks ? 'Remarks: ' + form.remarks : ''}`
          : `Your batch ${batch?.id} (${batch?.productName}) has been APPROVED. Grade: ${finalGrade}. Ready for manufacturing.`;

        await fetch('http://localhost:3001/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portalType: 'farmer',
            type: finalGrade === 'Rejected' ? 'BATCH_REJECTED' : 'BATCH_APPROVED',
            title: finalGrade === 'Rejected' ? 'Batch Rejected' : 'Batch Approved',
            message: notificationMessage,
            batchId: batch?.id || '',
            productName: batch?.productName || '',
            grade: finalGrade,
            timestamp: new Date().toISOString()
          })
        });
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
        // Don't fail the whole submission if notification fails
      }

      // Show success message
      setShowSuccess(true);
      
      // DO NOT download PDF - it's automatically attached to blockchain record
      // pdf.save() removed as per requirement
      
      // Call parent onSubmit callback
      onSubmit(batch?.id || '', event.data);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/lab/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit test results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">Batch Not Found</h3>
            <p>Invalid batch ID ({id}). Please go back and select a pending batch.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/lab/dashboard')}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border-2 border-green-500 text-green-800 px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Test Results Submitted Successfully!</h3>
              <p className="text-sm">Report generated and uploaded to blockchain.</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={() => navigate('/lab/dashboard')}
            className="flex items-center gap-2 px-4 py-2 mb-4 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FlaskConical className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Batch Testing - {batch.id}</h1>
                <p className="text-gray-600">Complete all required test fields</p>
              </div>
            </div>
            
            {/* Batch Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
              <div>
                <p className="text-sm text-gray-600 font-medium">Batch ID</p>
                <p className="font-bold text-gray-900">{batch.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Product</p>
                <p className="font-bold text-gray-900">{batch.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Farmer</p>
                <p className="font-bold text-gray-900">{batch.farmerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Received Date</p>
                <p className="font-bold text-gray-900">
                  {new Date(batch.collectionDate).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>
            
            {/* Already Tested Warning */}
            {isAlreadyTested && (
              <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-lg">⚠️ Batch Already Tested</h3>
                  <p>This batch has already been tested and results have been recorded on the blockchain. The data is immutable and cannot be modified.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Physical Tests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Droplet className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Physical Tests</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Moisture Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Moisture Content (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.moistureContent}
                  onChange={(e) => handleInputChange('moistureContent', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.moistureContent ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="5-12"
                />
                {errors.moistureContent && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.moistureContent}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: 5-12%</p>
              </div>

              {/* Ash Value */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ash Value (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.ashValue}
                  onChange={(e) => handleInputChange('ashValue', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.ashValue ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="1-5"
                />
                {errors.ashValue && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.ashValue}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: 1-5%</p>
              </div>

              {/* Foreign Matter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foreign Matter (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.foreignMatter}
                  onChange={(e) => handleInputChange('foreignMatter', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.foreignMatter ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="<2"
                />
                {errors.foreignMatter && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.foreignMatter}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: &lt;2%</p>
              </div>
            </div>
          </motion.div>

          {/* Chemical Tests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Beaker className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Chemical Tests</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* pH Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  pH Level *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.phLevel}
                  onChange={(e) => handleInputChange('phLevel', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phLevel ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="5.5-7.5"
                />
                {errors.phLevel && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phLevel}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: 5.5-7.5</p>
              </div>

              {/* Pesticide Residue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pesticide Residue (ppm) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.pesticideResidue}
                  onChange={(e) => handleInputChange('pesticideResidue', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pesticideResidue ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="<0.1"
                />
                {errors.pesticideResidue && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.pesticideResidue}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: &lt;0.1 ppm</p>
              </div>

              {/* Heavy Metals */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Heavy Metals (Pb, Cd, As, Hg) *
                </label>
                <select
                  value={form.heavyMetals}
                  onChange={(e) => handleInputChange('heavyMetals', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>

              {/* Solvent Residue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Solvent Residue *
                </label>
                <select
                  value={form.solventResidue}
                  onChange={(e) => handleInputChange('solventResidue', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>

              {/* Phytochemical Screening */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phytochemical Screening *
                </label>
                <select
                  value={form.phytochemicalScreening}
                  onChange={(e) => handleInputChange('phytochemicalScreening', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Biological Tests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Bug className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Biological Tests</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Microbial Test */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Microbial Test *
                </label>
                <select
                  value={form.microbialTest}
                  onChange={(e) => handleInputChange('microbialTest', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>

              {/* Fungal Count */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fungal Count (CFU/g) *
                </label>
                <input
                  type="number"
                  step="1"
                  value={form.fungalCount}
                  onChange={(e) => handleInputChange('fungalCount', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fungalCount ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="<1000"
                />
                {errors.fungalCount && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fungalCount}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: &lt;10³ CFU/g</p>
              </div>

              {/* E. coli / Salmonella */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E. coli / Salmonella *
                </label>
                <select
                  value={form.ecoliSalmonella}
                  onChange={(e) => handleInputChange('ecoliSalmonella', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                >
                  <option value="Absent">Absent</option>
                  <option value="Present">Present</option>
                </select>
              </div>

              {/* Aflatoxin Test */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aflatoxin Test (µg/kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.aflatoxinTest}
                  onChange={(e) => handleInputChange('aflatoxinTest', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.aflatoxinTest ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''}`}
                  placeholder="<5"
                />
                {errors.aflatoxinTest && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.aflatoxinTest}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">Expected: &lt;5 µg/kg</p>
              </div>
            </div>
          </motion.div>

          {/* Authentication Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Dna className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DNA Verification */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.dnaVerification}
                    onChange={(e) => handleInputChange('dnaVerification', e.target.checked)}
                    disabled={isAlreadyTested}
                    className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 ${
                      isAlreadyTested ? 'cursor-not-allowed' : ''
                    }`}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    DNA / Barcode Verification
                  </span>
                </label>
                <p className="mt-1 ml-8 text-xs text-gray-500">Check if verified</p>
              </div>

              {/* FTIR / HPTLC Fingerprint */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  FTIR / HPTLC Fingerprint *
                </label>
                <select
                  value={form.ftirFingerprint}
                  onChange={(e) => handleInputChange('ftirFingerprint', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <FileText className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Summary & Report Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quality Grade - Auto-Calculated */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quality Grade * 
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    ✨ Auto-Calculated
                  </span>
                </label>
                <div className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-bold flex items-center justify-between ${
                  form.qualityGrade === 'A' ? 'bg-green-50 border-green-500 text-green-700' :
                  form.qualityGrade === 'B' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                  form.qualityGrade === 'C' ? 'bg-orange-50 border-orange-500 text-orange-700' :
                  form.qualityGrade === 'F' ? 'bg-red-50 border-red-500 text-red-700' :
                  'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  <span>
                    {form.qualityGrade === 'A' && 'Grade A - Excellent ⭐'}
                    {form.qualityGrade === 'B' && 'Grade B - Good 👍'}
                    {form.qualityGrade === 'C' && 'Grade C - Acceptable ⚠️'}
                    {form.qualityGrade === 'F' && 'Grade F - Poor ❌'}
                    {!form.qualityGrade && 'Enter test results to calculate grade...'}
                  </span>
                  {form.qualityGrade && (
                    <span className="text-2xl">
                      {form.qualityGrade}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Grade is calculated automatically based on test parameters
                </p>
              </div>

              {/* Tested By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tested By *
                </label>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={form.testedBy}
                    onChange={(e) => handleInputChange('testedBy', e.target.value)}
                    disabled={isAlreadyTested}
                    className={`flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                    }`}
                    placeholder="Lab Technician Name"
                  />
                </div>
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Test Date *
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={form.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    disabled={isAlreadyTested}
                    className={`flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Test Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Test Time *
                </label>
                <input
                  type="time"
                  value={form.testTime}
                  onChange={(e) => handleInputChange('testTime', e.target.value)}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  rows={4}
                  disabled={isAlreadyTested}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAlreadyTested ? 'bg-gray-100 cursor-not-allowed text-gray-700' : ''
                  }`}
                  placeholder="Additional observations or notes..."
                />
              </div>
            </div>
          </motion.div>

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
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isAlreadyTested}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAlreadyTested ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Batch Already Tested - Read Only
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Submit Test Results & Generate Report
                </>
              )}
            </button>
          </motion.div>
        </form>

        {/* Approval Dialog for Grade C */}
        {showApprovalDialog && form.qualityGrade === 'C' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-orange-600">Grade C - Decision Required</h3>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                This batch has received a <span className="font-semibold text-orange-600">Grade C (Acceptable with Conditions)</span> rating. 
                Please review the test results and decide whether to approve for manufacturing or reject the batch.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> Approved batches will be sent to manufacturing. 
                  Rejected batches will be marked as failed and cannot be processed further.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setApprovalDecision('approve');
                    setShowApprovalDialog(false);
                    // Re-trigger submit
                    document.querySelector<HTMLFormElement>('form')?.requestSubmit();
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve for Manufacturing
                </button>
                <button
                  onClick={() => {
                    setApprovalDecision('reject');
                    setShowApprovalDialog(false);
                    // Re-trigger submit
                    document.querySelector<HTMLFormElement>('form')?.requestSubmit();
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Batch
                </button>
              </div>

              <button
                onClick={() => {
                  setShowApprovalDialog(false);
                  setApprovalDecision(null);
                }}
                className="w-full mt-4 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel and Review Results
              </button>
            </motion.div>
          </div>
        )}

        {/* Auto-Reject Message for Grade F */}
        {form.qualityGrade === 'F' && !isAlreadyTested && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 right-8 bg-red-600 text-white p-6 rounded-xl shadow-2xl max-w-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2">Automatic Rejection</h4>
                <p className="text-sm leading-relaxed">
                  This batch has received Grade F (Poor) due to critical test failures. 
                  It will be automatically rejected and sent to the Rejected/Failed section.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
