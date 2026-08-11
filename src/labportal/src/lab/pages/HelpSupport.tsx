import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Star,
  ChevronDown,
  Upload,
  Send,
  CheckCircle,
  Video,
  Link as LinkIcon,
  Package,
  TestTube,
  ArrowLeft,
  X,
  Shield,
  ClipboardList,
  Download
} from 'lucide-react';

interface HelpSupportProps {
  session: { labId: string } | null;
  onBack?: () => void;
}

export function HelpSupport({ session, onBack }: HelpSupportProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gettingStarted');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Appeal Form State
  const [appealData, setAppealData] = useState({
    batchId: '',
    reason: '',
    description: '',
    file: null as File | null
  });

  // Issue Form State
  const [issueData, setIssueData] = useState({
    category: '',
    description: '',
    file: null as File | null
  });

  // Contact Form State
  const [contactData, setContactData] = useState({
    subject: '',
    message: ''
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Appeal submitted:', appealData);
    showToast('Appeal submitted successfully');
    setShowAppealForm(false);
    setAppealData({ batchId: '', reason: '', description: '', file: null });
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Issue reported:', issueData);
    showToast('Issue reported successfully. Our team will review it soon.');
    setShowIssueForm(false);
    setIssueData({ category: '', description: '', file: null });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact message:', contactData);
    showToast('Message sent successfully');
    setShowContactForm(false);
    setContactData({ subject: '', message: '' });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback:', { rating, feedbackText });
    showToast('Thank you! Your feedback helps improve the system.');
    setRating(0);
    setFeedbackText('');
  };

  const tabs = [
    { id: 'gettingStarted', label: 'Getting Started', icon: BookOpen },
    { id: 'appeal', label: 'How to Appeal', icon: FileText },
    { id: 'reportIssue', label: 'Report a Problem', icon: AlertCircle },
    { id: 'guides', label: 'Guides & Tutorials', icon: Video },
    { id: 'faqs', label: 'FAQs', icon: MessageSquare },
    { id: 'contact', label: 'Contact Support', icon: Phone },
    { id: 'feedback', label: 'Feedback', icon: Star }
  ];

  const gettingStartedItems = [
    { title: 'How to log in to Lab Portal', icon: BookOpen },
    { title: 'How to test a new batch', icon: TestTube },
    { title: 'How to update test results', icon: ClipboardList },
    { title: 'How to verify blockchain data', icon: Shield },
    { title: 'How to download PDF reports', icon: Download }
  ];

  const guidesData = [
    { title: '🧪 Testing New Batches', icon: TestTube, color: 'blue' },
    { title: '🔗 Understand Blockchain Verification', icon: LinkIcon, color: 'purple' },
    { title: '📊 Lab Reports & Analytics', icon: ClipboardList, color: 'green' },
    { title: '⚠️ Handling Rejected Batches', icon: AlertCircle, color: 'orange' },
    { title: '📄 Generating PDF Reports', icon: FileText, color: 'red' }
  ];

  const faqsData = [
    { 
      q: 'Why is batch ID not found?', 
      a: 'The batch may not be registered yet by the farmer. Verify the Batch ID format and contact the farmer to confirm submission.' 
    },
    { 
      q: 'What does "Blockchain Verified" mean?', 
      a: 'It means the test data has been permanently recorded on the blockchain and cannot be altered or tampered with.' 
    },
    { 
      q: 'Can I edit test results after submission?', 
      a: 'No, once submitted to blockchain, data cannot be edited. This ensures data integrity and prevents tampering.' 
    },
    { 
      q: 'How to assign grades to batches?', 
      a: 'Grades (A, B, C) are assigned based on test parameter thresholds. The system auto-calculates based on your entries.' 
    },
    { 
      q: 'Why is the ledger not updating?', 
      a: 'Check your internet connection. Wait 30 seconds for blockchain sync. Refresh the page or restart the application.' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-6 border-b-2 border-blue-200">
        <div className="max-w-7xl mx-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Help & Support</h1>
          <p className="text-blue-700">Find answers, report issues, and get assistance</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-500 border-b-2 border-blue-400 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {/* Getting Started */}
          {activeTab === 'gettingStarted' && (
            <motion.div
              key="gettingStarted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gettingStartedItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <item.icon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">Click to learn more</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Appeal / Raise Dispute */}
          {activeTab === 'appeal' && (
            <motion.div
              key="appeal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Appeal / Raise a Dispute</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-700 mb-3">What is an appeal?</h3>
                <p className="text-blue-600 mb-4">
                  An appeal allows you to dispute decisions regarding test results, grades, or batch rejections. 
                  This ensures transparency and allows for review of lab decisions.
                </p>
                
                <h3 className="font-semibold text-blue-700 mb-2">When can I raise it?</h3>
                <ul className="list-disc list-inside text-blue-600 space-y-1 mb-4">
                  <li>Incorrect test result or grade assignment</li>
                  <li>Missing or incomplete test data</li>
                  <li>Unfairly rejected batch due to testing errors</li>
                  <li>Other quality assessment concerns</li>
                </ul>
              </div>

              <button
                onClick={() => setShowAppealForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Submit an Appeal
              </button>
            </motion.div>
          )}

          {/* Report Issue */}
          {activeTab === 'reportIssue' && (
            <motion.div
              key="reportIssue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Report a Problem</h2>
              <p className="text-gray-600 mb-6">Having technical issues or found a bug? Let us know so we can fix it.</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/lab/support/report')}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Report an Issue
                </button>
                
                <button
                  onClick={() => navigate('/lab/support/tickets')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ClipboardList className="w-5 h-5" />
                  View My Tickets
                </button>
              </div>
            </motion.div>
          )}

          {/* Guides & Tutorials */}
          {activeTab === 'guides' && (
            <motion.div
              key="guides"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Guides & Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidesData.map((guide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className={`bg-${guide.color}-100 p-4 rounded-lg mb-4 inline-block`}>
                      <guide.icon className={`w-8 h-8 text-${guide.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{guide.title}</h3>
                    <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                      View Guide →
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* FAQs */}
          {activeTab === 'faqs' && (
            <motion.div
              key="faqs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqsData.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-gray-800">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 transition-transform ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-gray-600">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact Support */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Support</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <Phone className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Helpline</h3>
                      <p className="text-lg font-bold text-gray-900">1800-2025-25027</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-900">support@ayurchain.in</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Office Hours</h3>
                      <p className="text-gray-900">9 AM – 6 PM (Monday to Saturday)</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowContactForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </motion.div>
          )}

          {/* Feedback */}
          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Feedback & Rating</h2>
              
              <form onSubmit={handleFeedbackSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rate your experience
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-10 h-10 ${
                            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your feedback
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Tell us about your experience with the Lab Portal..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Submit Feedback
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Appeal Form Modal */}
      <AnimatePresence>
        {showAppealForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAppealForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Submit an Appeal</h3>
                <button onClick={() => setShowAppealForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAppealSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch ID
                  </label>
                  <select
                    value={appealData.batchId}
                    onChange={(e) => setAppealData({ ...appealData, batchId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  >
                    <option value="">Select Batch</option>
                    <option value="NEEM-2024-001">NEEM-2024-001</option>
                    <option value="TULSI-2024-045">TULSI-2024-045</option>
                    <option value="ASHWA-2024-023">ASHWA-2024-023</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Appeal
                  </label>
                  <select
                    value={appealData.reason}
                    onChange={(e) => setAppealData({ ...appealData, reason: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  >
                    <option value="">Select Reason</option>
                    <option value="incorrect-result">Incorrect Test Result</option>
                    <option value="missing-data">Missing Data</option>
                    <option value="rejected-batch">Rejected Batch</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={appealData.description}
                    onChange={(e) => setAppealData({ ...appealData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Describe your appeal in detail..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Supporting File (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setAppealData({ ...appealData, file: e.target.files?.[0] || null })}
                      className="hidden"
                      id="appeal-file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="appeal-file" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload PDF or Image</p>
                      {appealData.file && <p className="text-sm text-blue-600 mt-2">{appealData.file.name}</p>}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Submit Appeal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppealForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Issue Report Form Modal */}
      <AnimatePresence>
        {showIssueForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowIssueForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Report an Issue</h3>
                <button onClick={() => setShowIssueForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleIssueSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={issueData.category}
                    onChange={(e) => setIssueData({ ...issueData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="portal-bug">Portal Bug</option>
                    <option value="blockchain-sync">Blockchain Sync Issue</option>
                    <option value="data-error">Data Entry Error</option>
                    <option value="pdf-error">PDF Generation Error</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={issueData.description}
                    onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Describe the issue you encountered..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Screenshot (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setIssueData({ ...issueData, file: e.target.files?.[0] || null })}
                      className="hidden"
                      id="issue-file"
                      accept=".jpg,.jpeg,.png"
                    />
                    <label htmlFor="issue-file" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload screenshot</p>
                      {issueData.file && <p className="text-sm text-blue-600 mt-2">{issueData.file.name}</p>}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Submit Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIssueForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Send Message</h3>
                <button onClick={() => setShowContactForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Enter subject"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
