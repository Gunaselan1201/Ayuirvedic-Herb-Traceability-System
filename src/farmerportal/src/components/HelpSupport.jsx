import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X
} from 'lucide-react';

const HelpSupport = ({ onBack, t }) => {
  const [activeTab, setActiveTab] = useState('gettingStarted');
  const [expandedFaq, setExpandedFaq] = useState(null);
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
    file: null
  });

  // Issue Form State
  const [issueData, setIssueData] = useState({
    category: '',
    description: '',
    file: null
  });

  // Contact Form State
  const [contactData, setContactData] = useState({
    subject: '',
    message: ''
  });

  const showToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleAppealSubmit = (e) => {
    e.preventDefault();
    // Save to appeals.json or send to API
    console.log('Appeal submitted:', appealData);
    showToast(t('appealSubmittedSuccess') || 'Appeal submitted successfully');
    setShowAppealForm(false);
    setAppealData({ batchId: '', reason: '', description: '', file: null });
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    // Save to issues.json or send to API
    console.log('Issue reported:', issueData);
    showToast(t('issueReportedSuccess') || 'Issue reported successfully. Our team will review it soon.');
    setShowIssueForm(false);
    setIssueData({ category: '', description: '', file: null });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Send message
    console.log('Contact message:', contactData);
    showToast(t('messageSentSuccess') || 'Message sent successfully');
    setShowContactForm(false);
    setContactData({ subject: '', message: '' });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Save to feedback.json
    console.log('Feedback:', { rating, feedbackText });
    showToast(t('feedbackThanks') || 'Thank you! Your feedback helps improve the system.');
    setRating(0);
    setFeedbackText('');
  };

  const tabs = [
    { id: 'gettingStarted', label: t('gettingStarted') || 'Getting Started', icon: BookOpen },
    { id: 'appeal', label: t('howToAppeal') || 'How to Appeal', icon: FileText },
    { id: 'reportIssue', label: t('reportProblem') || 'Report a Problem', icon: AlertCircle },
    { id: 'guides', label: t('guidesAndTutorials') || 'Guides & Tutorials', icon: Video },
    { id: 'faqs', label: t('faqs') || 'FAQs', icon: MessageSquare },
    { id: 'contact', label: t('contactSupport') || 'Contact Support', icon: Phone },
    { id: 'feedback', label: t('feedback') || 'Feedback', icon: Star }
  ];

  const gettingStartedItems = [
    { title: t('howToLogin') || 'How to log in', icon: BookOpen },
    { title: t('howToAddBatch') || 'How to add a new herb/product batch', icon: Package },
    { title: t('howToGenerateBatchId') || 'How to generate batch ID', icon: LinkIcon },
    { title: t('howToCheckStatus') || 'How to check submission status', icon: CheckCircle },
    { title: t('howToChangeLanguage') || 'How to change portal language', icon: MessageSquare }
  ];

  const guidesData = [
    { title: t('submitNewBatch') || '🌿 Submit a New Batch', icon: Package, color: 'blue' },
    { title: t('understandBlockchain') || '🔗 Understand Blockchain Verification', icon: LinkIcon, color: 'purple' },
    { title: t('trackingViaQR') || '📦 Tracking Product Journey via QR', icon: LinkIcon, color: 'green' },
    { title: t('howLabWorks') || '🧪 How Lab Testing Works', icon: TestTube, color: 'orange' },
    { title: t('appealRejected') || '💬 Appealing a Rejected Batch', icon: FileText, color: 'red' }
  ];

  const faqsData = [
    { q: t('faqPending') || 'Why is my batch still pending?', a: t('faqPendingAnswer') || 'Your batch is currently under laboratory testing. This process typically takes 3-5 business days.' },
    { q: t('faqBlockchain') || 'What does "Blockchain Verified" mean?', a: t('faqBlockchainAnswer') || 'It means your batch data has been permanently recorded on the blockchain and cannot be altered.' },
    { q: t('faqEditData') || 'Can I edit my data after submission?', a: t('faqEditDataAnswer') || 'Once submitted, batch data cannot be edited due to blockchain immutability. Please contact support if corrections are needed.' },
    { q: t('faqContactLab') || 'How to contact my nearest lab?', a: t('faqContactLabAnswer') || 'Go to the "Sent for Testing" section to view lab contact details for your batch.' },
    { q: t('faqResetPassword') || 'How to reset password?', a: t('faqResetPasswordAnswer') || 'Contact your portal administrator or use the "Forgot Password" link on the login page.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 border-b-2 border-green-200">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back') || 'Back'}
          </button>
          <h1 className="text-3xl font-bold mb-2 text-green-800">{t('helpSupport') || 'Help & Support'}</h1>
          <p className="text-green-700">{t('helpSupportDesc') || 'Find answers, report issues, and get assistance'}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'text-green-500 border-b-2 border-green-400 bg-green-50'
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('gettingStarted') || 'Getting Started'}</h2>
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
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <item.icon className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600">{t('clickToLearnMore') || 'Click to learn more'}</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('howToAppeal') || 'How to Appeal / Raise a Dispute'}</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-green-700 mb-3">{t('whatIsAppeal') || 'What is an appeal?'}</h3>
                <p className="text-green-600 mb-4">{t('appealExplanation') || 'An appeal allows you to clarify or dispute decisions made by the lab or manufacturer regarding your batch, such as incorrect test results, wrong grades, or rejected batches.'}</p>
                
                <h3 className="font-semibold text-green-700 mb-2">{t('whenToAppeal') || 'When can I raise it?'}</h3>
                <ul className="list-disc list-inside text-green-600 space-y-1 mb-4">
                  <li>{t('appealReason1') || 'Incorrect lab result or grade'}</li>
                  <li>{t('appealReason2') || 'Missing or incomplete data'}</li>
                  <li>{t('appealReason3') || 'Unfairly rejected batch'}</li>
                  <li>{t('appealReason4') || 'Other quality concerns'}</li>
                </ul>
              </div>

              <button
                onClick={() => setShowAppealForm(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                {t('submitAppeal') || 'Submit an Appeal'}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('reportProblem') || 'Report a Problem'}</h2>
              <p className="text-gray-600 mb-6">{t('reportProblemDesc') || 'Having technical issues or found a bug? Let us know so we can fix it.'}</p>
              
              <button
                onClick={() => setShowIssueForm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                {t('reportIssue') || 'Report an Issue'}
              </button>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('guidesAndTutorials') || 'Guides & Tutorials'}</h2>
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
                    <button className="text-green-500 text-sm font-medium hover:text-green-600">
                      {t('viewGuide') || 'View Guide'} →
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('faqs') || 'Frequently Asked Questions'}</h2>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('contactSupport') || 'Contact Support'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <Phone className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('helpline') || 'Helpline'}</h3>
                      <p className="text-lg font-bold text-gray-900">1800-2025-25027</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <Mail className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('email') || 'Email'}</h3>
                      <p className="text-gray-900">support@ayurledger.gov.in</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 md:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('officeHours') || 'Office Hours'}</h3>
                      <p className="text-gray-900">{t('officeHoursTime') || '9 AM – 6 PM (Monday to Saturday)'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowContactForm(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t('sendMessage') || 'Send Message'}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('feedback') || 'Feedback & Rating'}</h2>
              
              <form onSubmit={handleFeedbackSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t('rateExperience') || 'Rate your experience'}
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
                    {t('yourFeedback') || 'Your feedback'}
                  </label>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder={t('feedbackPlaceholder') || 'Tell us about your experience...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={rating === 0}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {t('submitFeedback') || 'Submit Feedback'}
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
                <h3 className="text-2xl font-bold text-gray-800">{t('submitAppeal') || 'Submit an Appeal'}</h3>
                <button onClick={() => setShowAppealForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAppealSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('batchId') || 'Batch ID'}
                  </label>
                  <select
                    value={appealData.batchId}
                    onChange={(e) => setAppealData({ ...appealData, batchId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  >
                    <option value="">{t('selectBatch') || 'Select Batch'}</option>
                    <option value="NEEM-2024-001">NEEM-2024-001</option>
                    <option value="TULSI-2024-045">TULSI-2024-045</option>
                    <option value="ASHWA-2024-023">ASHWA-2024-023</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('reasonForAppeal') || 'Reason for Appeal'}
                  </label>
                  <select
                    value={appealData.reason}
                    onChange={(e) => setAppealData({ ...appealData, reason: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  >
                    <option value="">{t('selectReason') || 'Select Reason'}</option>
                    <option value="incorrect-result">{t('incorrectLabResult') || 'Incorrect Lab Result'}</option>
                    <option value="missing-data">{t('missingData') || 'Missing Data'}</option>
                    <option value="rejected-batch">{t('rejectedBatch') || 'Rejected Batch'}</option>
                    <option value="other">{t('other') || 'Other'}</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('description') || 'Description'}
                  </label>
                  <textarea
                    value={appealData.description}
                    onChange={(e) => setAppealData({ ...appealData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder={t('describeAppeal') || 'Describe your appeal in detail...'}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('uploadFile') || 'Upload Supporting File (Optional)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-300 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setAppealData({ ...appealData, file: e.target.files[0] })}
                      className="hidden"
                      id="appeal-file"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="appeal-file" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{t('clickToUpload') || 'Click to upload PDF or Image'}</p>
                      {appealData.file && <p className="text-sm text-green-600 mt-2">{appealData.file.name}</p>}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    {t('submit') || 'Submit Appeal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppealForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel') || 'Cancel'}
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
                <h3 className="text-2xl font-bold text-gray-800">{t('reportIssue') || 'Report an Issue'}</h3>
                <button onClick={() => setShowIssueForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleIssueSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('category') || 'Category'}
                  </label>
                  <select
                    value={issueData.category}
                    onChange={(e) => setIssueData({ ...issueData, category: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  >
                    <option value="">{t('selectCategory') || 'Select Category'}</option>
                    <option value="portal-bug">{t('portalBug') || 'Portal Bug'}</option>
                    <option value="qr-error">{t('qrError') || 'QR Error'}</option>
                    <option value="data-missing">{t('dataMissing') || 'Data Missing'}</option>
                    <option value="other">{t('other') || 'Other'}</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('description') || 'Description'}
                  </label>
                  <textarea
                    value={issueData.description}
                    onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder={t('describeIssue') || 'Describe the issue you encountered...'}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('uploadScreenshot') || 'Upload Screenshot (Optional)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-300 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => setIssueData({ ...issueData, file: e.target.files[0] })}
                      className="hidden"
                      id="issue-file"
                      accept=".jpg,.jpeg,.png"
                    />
                    <label htmlFor="issue-file" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{t('clickToUploadImage') || 'Click to upload screenshot'}</p>
                      {issueData.file && <p className="text-sm text-green-600 mt-2">{issueData.file.name}</p>}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    {t('submitReport') || 'Submit Report'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIssueForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel') || 'Cancel'}
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
                <h3 className="text-2xl font-bold text-gray-800">{t('sendMessage') || 'Send Message'}</h3>
                <button onClick={() => setShowContactForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('subject') || 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder={t('subjectPlaceholder') || 'Enter subject'}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('message') || 'Message'}
                  </label>
                  <textarea
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder={t('messagePlaceholder') || 'Type your message here...'}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {t('send') || 'Send'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    {t('cancel') || 'Cancel'}
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
            className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpSupport;
