import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertCircle, MessageSquare, Phone, Mail, Send, Upload, X } from 'lucide-react';

const HelpSupport = ({ currentLanguage, onLanguageChange }) => {
  const [issueText, setIssueText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const t = (key) => {
    const translations = {
      en: {
        helpSupport: 'Help & Support',
        languageSettings: 'Language Settings',
        currentLanguage: 'Current Language',
        changeLanguage: 'Change Language',
        reportIssue: 'Report an Issue',
        describeIssue: 'Describe your issue...',
        attachFile: 'Attach File (Optional)',
        submitIssue: 'Submit Issue',
        contactSupport: 'Contact Support',
        email: 'Email',
        whatsapp: 'WhatsApp',
        tollFree: 'Toll Free',
        faqSection: 'Frequently Asked Questions',
        faq1: 'How do I track my order?',
        faq1Ans: 'You can track your order status in the Active Orders or Sent to Manufacturing section.',
        faq2: 'How do I download receipts?',
        faq2Ans: 'Go to Sent to Manufacturing and click the Download Receipt button next to your order.',
        faq3: 'What if my order is rejected?',
        faq3Ans: 'You can appeal or reconsider rejected orders from the Rejected Orders section.',
        issueSubmitted: 'Issue submitted successfully! Our team will contact you soon.',
        selectLanguage: 'Select Language',
      },
      ta: {
        helpSupport: 'உதவி & ஆதரவு',
        languageSettings: 'மொழி அமைப்புகள்',
        currentLanguage: 'தற்போதைய மொழி',
        changeLanguage: 'மொழியை மாற்று',
        reportIssue: 'சிக்கலைப் புகாரளி',
        describeIssue: 'உங்கள் சிக்கலை விவரிக்கவும்...',
        attachFile: 'கோப்பை இணைக்கவும் (விருப்பமானது)',
        submitIssue: 'சிக்கலைச் சமர்ப்பிக்கவும்',
        contactSupport: 'ஆதரவைத் தொடர்புகொள்ளவும்',
        email: 'மின்னஞ்சல்',
        whatsapp: 'WhatsApp',
        tollFree: 'டோல் ஃப்ரீ',
        faqSection: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
        faq1: 'எனது ஆர்டரை எவ்வாறு கண்காணிப்பது?',
        faq1Ans: 'செயலில் உள்ள ஆர்டர்கள் அல்லது நிறைவான ஆர்டர்கள் பிரிவில் உங்கள் ஆர்டர் நிலையைக் கண்காணிக்கலாம்.',
        faq2: 'ரசீதுகளை எவ்வாறு பதிவிறக்குவது?',
        faq2Ans: 'நிறைவான ஆர்டர்களுக்குச் சென்று உங்கள் ஆர்டரின் அருகில் உள்ள ரசீதைப் பதிவிறக்கு பட்டனைக் கிளிக் செய்யவும்.',
        faq3: 'எனது ஆர்டர் நிராகரிக்கப்பட்டால் என்ன செய்வது?',
        faq3Ans: 'நிராகரிக்கப்பட்ட ஆர்டர்கள் பிரிவில் இருந்து நீங்கள் மேல்முறையீடு செய்யலாம் அல்லது மறுபரிசீலனை செய்யலாம்.',
        issueSubmitted: 'சிக்கல் வெற்றிகரமாகச் சமர்ப்பிக்கப்பட்டது! எங்கள் குழு விரைவில் உங்களைத் தொடர்புகொள்ளும்.',
        selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
      },
      hi: {
        helpSupport: 'सहायता और समर्थन',
        languageSettings: 'भाषा सेटिंग्स',
        currentLanguage: 'वर्तमान भाषा',
        changeLanguage: 'भाषा बदलें',
        reportIssue: 'समस्या रिपोर्ट करें',
        describeIssue: 'अपनी समस्या का वर्णन करें...',
        attachFile: 'फाइल संलग्न करें (वैकल्पिक)',
        submitIssue: 'समस्या सबमिट करें',
        contactSupport: 'समर्थन से संपर्क करें',
        email: 'ईमेल',
        whatsapp: 'WhatsApp',
        tollFree: 'टोल फ्री',
        faqSection: 'अक्सर पूछे जाने वाले प्रश्न',
        faq1: 'मैं अपने आदेश को कैसे ट्रैक करूं?',
        faq1Ans: 'आप सक्रिय आदेश या पूर्ण आदेश अनुभाग में अपने आदेश की स्थिति को ट्रैक कर सकते हैं।',
        faq2: 'मैं रसीदें कैसे डाउनलोड करूं?',
        faq2Ans: 'पूर्ण आदेश पर जाएं और अपने आदेश के बगल में रसीद डाउनलोड करें बटन पर क्लिक करें।',
        faq3: 'यदि मेरा आदेश अस्वीकार कर दिया जाता है तो क्या होगा?',
        faq3Ans: 'आप अस्वीकृत आदेश अनुभाग से अस्वीकृत आदेशों के लिए अपील या पुनर्विचार कर सकते हैं।',
        issueSubmitted: 'समस्या सफलतापूर्वक सबमिट की गई! हमारी टीम जल्द ही आपसे संपर्क करेगी।',
        selectLanguage: 'भाषा चुनें',
      }
    };
    return translations[currentLanguage]?.[key] || translations['en'][key] || key;
  };

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitIssue = async () => {
    if (!issueText.trim()) return;

    // TODO: Send to backend API
    console.log('Submitting issue:', { text: issueText, file: selectedFile });
    
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIssueText('');
      setSelectedFile(null);
    }, 3000);
  };

  const faqs = [
    { question: t('faq1'), answer: t('faq1Ans') },
    { question: t('faq2'), answer: t('faq2Ans') },
    { question: t('faq3'), answer: t('faq3Ans') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          {t('helpSupport')}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Issue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t('reportIssue')}</h2>
            </div>

            <textarea
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              placeholder={t('describeIssue')}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none mb-4"
            />

            <div className="mb-4">
              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">{t('attachFile')}</span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
              {selectedFile && (
                <div className="mt-2 flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-red-600 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmitIssue}
              disabled={!issueText.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-5 h-5" />
              {t('submitIssue')}
            </motion.button>

            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg text-sm"
                >
                  {t('issueSubmitted')}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t('contactSupport')}</h2>
            </div>

            <div className="space-y-3">
              <a href="mailto:support@farmerportal.com" className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('email')}</p>
                  <p className="text-xs text-gray-600">support@farmerportal.com</p>
                </div>
              </a>

              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('whatsapp')}</p>
                  <p className="text-xs text-gray-600">+91 98765 43210</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Phone className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('tollFree')}</p>
                  <p className="text-xs text-gray-600">1800-123-4567</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{t('faqSection')}</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-800 mb-2">{faq.question}</p>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
