import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  X,
  AlertTriangle,
  TestTube,
  MessageSquare
} from 'lucide-react';

interface ReportIssueProps {
  session: { labId: string } | null;
}

export function ReportIssue({ session }: ReportIssueProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    batchId: '',
    issueTitle: '',
    description: '',
    labId: session?.labId || '',
    userName: 'Lab Technician'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const categories = [
    { value: 'Portal Error', label: 'Portal Error' },
    { value: 'Data Entry Problem', label: 'Data Entry Problem' },
    { value: 'Blockchain Sync Failure', label: 'Blockchain Sync Failure' },
    { value: 'Test Result Update Issue', label: 'Test Result Update Issue' },
    { value: 'Report Download Issue', label: 'Report Download Issue' },
    { value: 'Other', label: 'Other' }
  ];

  const totalSteps = 4;

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
    }

    if (step === 2) {
      if (!formData.issueTitle.trim()) {
        newErrors.issueTitle = 'Issue title is required';
      } else if (formData.issueTitle.length > 120) {
        newErrors.issueTitle = 'Issue title must be 120 characters or less';
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 30) {
        newErrors.description = 'Description must be at least 30 characters';
      }
    }

    if (step === 3 && selectedFile) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(selectedFile.type)) {
        newErrors.file = 'Only PNG, JPG, JPEG, and PDF files are allowed';
      }

      if (selectedFile.size > maxSize) {
        newErrors.file = 'File size must be 5MB or less';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setErrors({ file: 'Only PNG, JPG, JPEG, and PDF files are allowed' });
        return;
      }

      if (file.size > maxSize) {
        setErrors({ file: 'File size must be 5MB or less' });
        return;
      }

      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userName', formData.userName);
      formDataToSend.append('labId', formData.labId);
      formDataToSend.append('issueType', formData.category);
      formDataToSend.append('severity', 'Medium');
      formDataToSend.append('description', `${formData.issueTitle}\n\n${formData.description}`);
      formDataToSend.append('timestamp', new Date().toISOString());

      if (formData.batchId) {
        formDataToSend.append('batchId', formData.batchId);
      }

      if (selectedFile) {
        formDataToSend.append('attachment', selectedFile);
      }

      const response = await fetch('http://localhost:5174/api/support/tickets', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit issue');
      }

      const result = await response.json();

      // Show success toast
      setToastMessage(`✅ Issue reported successfully. Ticket ID: ${result.ticketId}`);
      setShowToast(true);

      // Clear form
      setFormData({
        category: '',
        batchId: '',
        issueTitle: '',
        description: '',
        labId: session?.labId || '',
        userName: 'Lab Technician'
      });
      setSelectedFile(null);
      setFilePreview(null);
      setCurrentStep(1);

      // Hide toast after 5 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 5000);

    } catch (error: any) {
      console.error('Error submitting issue:', error);
      setToastMessage(`❌ Error: ${error.message}`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: 'Category', icon: AlertTriangle },
    { id: 2, label: 'Details', icon: FileText },
    { id: 3, label: 'Attachments', icon: Upload },
    { id: 4, label: 'Review', icon: CheckCircle2 }
  ];

  const renderStepIndicator = () => (
    <div className="flex border-b border-gray-200">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <button
            key={step.id}
            onClick={() => {
              if (step.id < currentStep) {
                setCurrentStep(step.id);
              }
            }}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative flex items-center justify-center gap-2 ${
              currentStep === step.id
                ? 'text-blue-700 border-b-3 border-blue-600 bg-blue-50'
                : currentStep > step.id
                ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            style={currentStep === step.id ? { borderBottomWidth: '3px' } : {}}
            disabled={step.id > currentStep}
          >
            <Icon className="w-4 h-4" />
            {step.label}
          </button>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Issue Category</h2>
        <p className="text-gray-600">Choose the category that best describes your issue</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center max-w-4xl mx-auto">
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleInputChange('category', cat.value)}
            className={`p-6 rounded-xl border-2 transition-all shadow-md flex flex-col items-center justify-center min-h-[120px] w-full ${
              formData.category === cat.value
                ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-cyan-100 shadow-xl ring-2 ring-blue-200'
                : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            <div className={`text-base font-bold mb-2 text-center ${
              formData.category === cat.value ? 'text-blue-700' : 'text-gray-900'
            }`}>
              {cat.label}
            </div>
            {formData.category === cat.value && (
              <CheckCircle2 className="w-5 h-5 text-blue-600 mt-2" />
            )}
          </motion.button>
        ))}
      </div>

      {errors.category && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2 justify-center">
          <AlertCircle className="w-4 h-4" />
          {errors.category}
        </div>
      )}
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Describe Your Issue</h2>
        <p className="text-gray-600">Provide a clear title and detailed description</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Issue Title *
        </label>
        <input
          type="text"
          value={formData.issueTitle}
          onChange={(e) => handleInputChange('issueTitle', e.target.value)}
          placeholder="Brief summary of the issue (max 120 characters)"
          maxLength={120}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            errors.issueTitle ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.issueTitle ? (
            <span className="text-red-600 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.issueTitle}
            </span>
          ) : (
            <span className="text-gray-500 text-sm">Required</span>
          )}
          <span className="text-gray-500 text-sm">{formData.issueTitle.length}/120</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the issue in detail (minimum 30 characters)"
          rows={6}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <span className="text-red-600 text-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.description}
            </span>
          ) : (
            <span className="text-gray-500 text-sm">Minimum 30 characters</span>
          )}
          <span className="text-gray-500 text-sm">{formData.description.length} chars</span>
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
        <p className="text-gray-600">Add batch ID and attach files if needed</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <TestTube className="w-4 h-4 text-blue-600" />
          Batch ID (Optional)
        </label>
        <input
          type="text"
          value={formData.batchId}
          onChange={(e) => handleInputChange('batchId', e.target.value)}
          placeholder="Enter batch ID if applicable"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          <Upload className="w-4 h-4 text-blue-600" />
          Attach File (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50">
          {!selectedFile ? (
            <label className="cursor-pointer block">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-1">Click to upload file</p>
              <p className="text-sm text-gray-500">PNG, JPG, PDF (max 5MB)</p>
            </label>
          ) : (
            <div className="space-y-3">
              {filePreview && (
                <img src={filePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
              )}
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 font-medium">{selectedFile.name}</span>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-red-600" />
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
        {errors.file && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            {errors.file}
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your issue details before submitting</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 space-y-4 border-2 border-blue-200">
        <div className="flex items-start gap-3 pb-4 border-b-2 border-blue-200">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-600 mb-1">Category</div>
            <div className="text-gray-900 font-bold text-lg">{formData.category}</div>
          </div>
        </div>

        {formData.batchId && (
          <div className="flex items-start gap-3 pb-4 border-b-2 border-blue-200">
            <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
              <TestTube className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-600 mb-1">Batch ID</div>
              <div className="text-gray-900 font-bold text-lg">{formData.batchId}</div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 pb-4 border-b-2 border-blue-200">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-600 mb-1">Issue Title</div>
            <div className="text-gray-900 font-bold">{formData.issueTitle}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 pb-4 border-b-2 border-blue-200">
          <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-600 mb-1">Description</div>
            <div className="text-gray-800 leading-relaxed">{formData.description}</div>
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-600 mb-1">Attachment</div>
              <div className="text-gray-900 font-bold">{selectedFile.name}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 shadow-md">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-800">
            <strong className="text-blue-700">Note:</strong> Once submitted, your issue will be assigned a unique ticket ID. 
            You can track the status of your issue in the "View Tickets" section.
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-2xl p-4 max-w-md border-l-4 border-blue-600"
          >
            <div className="flex items-start gap-3">
              {toastMessage.includes('✅') ? (
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-gray-900 font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => navigate('/lab/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-700 mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
              <p className="text-gray-600 mt-2">
                Help us improve by reporting any problems you encounter
              </p>
            </div>
            <AlertCircle className="w-16 h-16 text-blue-600 opacity-20" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden">
          {renderStepIndicator()}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12 pt-6 border-t-2 border-gray-200 max-w-4xl">
            <motion.button
              whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all shadow-md ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-lg'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </motion.button>

            {currentStep < totalSteps ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-10 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Issue
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
