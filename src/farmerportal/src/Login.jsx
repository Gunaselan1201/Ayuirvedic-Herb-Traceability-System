import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, Globe } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('farmerPortalLanguage') || 'en';
  });

  // Translation object - 10 Languages
  const translations = {
    en: {
      title: 'FARMER PORTAL',
      subtitle: 'Sign in to continue',
      userIdLabel: 'User ID',
      userIdPlaceholder: 'Enter User ID',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter Password',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      errorMessage: 'Invalid User ID or Password',
      footer: '© 2025 Farmer Portal. All rights reserved.',
      languageLabel: 'Language'
    },
    ta: {
      title: 'விவசாயி போர்டல்',
      subtitle: 'தொடர உள்நுழையவும்',
      userIdLabel: 'பயனர் ID',
      userIdPlaceholder: 'பயனர் ID-ஐ உள்ளிடவும்',
      passwordLabel: 'கடவுச்சொல்',
      passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
      loginButton: 'உள்நுழைய',
      loggingIn: 'உள்நுழைகிறது...',
      errorMessage: 'தவறான பயனர் ID அல்லது கடவுச்சொல்',
      footer: '© 2025 விவசாயி போர்டல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
      languageLabel: 'மொழி'
    },
    hi: {
      title: 'किसान पोर्टल',
      subtitle: 'जारी रखने के लिए साइन इन करें',
      userIdLabel: 'यूज़र आईडी',
      userIdPlaceholder: 'यूज़र आईडी दर्ज करें',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'पासवर्ड दर्ज करें',
      loginButton: 'लॉगिन',
      loggingIn: 'लॉगिन हो रहा है...',
      errorMessage: 'अमान्य यूज़र आईडी या पासवर्ड',
      footer: '© 2025 किसान पोर्टल। सर्वाधिकार सुरक्षित।',
      languageLabel: 'भाषा'
    },
    te: {
      title: 'రైతు పోర్టల్',
      subtitle: 'కొనసాగించడానికి సైన్ ఇన్ చేయండి',
      userIdLabel: 'యూజర్ ID',
      userIdPlaceholder: 'యూజర్ ID నమోదు చేయండి',
      passwordLabel: 'పాస్‌వర్డ్',
      passwordPlaceholder: 'పాస్‌వర్డ్ నమోదు చేయండి',
      loginButton: 'లాగిన్',
      loggingIn: 'లాగిన్ అవుతోంది...',
      errorMessage: 'చెల్లని యూజర్ ID లేదా పాస్‌వర్డ్',
      footer: '© 2025 రైతు పోర్టల్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
      languageLabel: 'భాష'
    },
    kn: {
      title: 'ರೈತ ಪೋರ್ಟಲ್',
      subtitle: 'ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ',
      userIdLabel: 'ಯೂಸರ್ ID',
      userIdPlaceholder: 'ಯೂಸರ್ ID ನಮೂದಿಸಿ',
      passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
      passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
      loginButton: 'ಲಾಗಿನ್',
      loggingIn: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
      errorMessage: 'ಅಮಾನ್ಯ ಯೂಸರ್ ID ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್',
      footer: '© 2025 ರೈತ ಪೋರ್ಟಲ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      languageLabel: 'ಭಾಷೆ'
    },
    ml: {
      title: 'കർഷക പോർട്ടൽ',
      subtitle: 'തുടരാൻ സൈൻ ഇൻ ചെയ്യുക',
      userIdLabel: 'യൂസർ ID',
      userIdPlaceholder: 'യൂസർ ID നൽകുക',
      passwordLabel: 'പാസ്‌വേഡ്',
      passwordPlaceholder: 'പാസ്‌വേഡ് നൽകുക',
      loginButton: 'ലോഗിൻ',
      loggingIn: 'ലോഗിൻ ചെയ്യുന്നു...',
      errorMessage: 'അസാധുവായ യൂസർ ID അല്ലെങ്കിൽ പാസ്‌വേഡ്',
      footer: '© 2025 കർഷക പോർട്ടൽ. എല്ലാ അവകാശങ്ങളും സംരക്ഷിതമാണ്.',
      languageLabel: 'ഭാഷ'
    },
    mr: {
      title: 'शेतकरी पोर्टल',
      subtitle: 'सुरू ठेवण्यासाठी साइन इन करा',
      userIdLabel: 'यूजर ID',
      userIdPlaceholder: 'यूजर ID प्रविष्ट करा',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'पासवर्ड प्रविष्ट करा',
      loginButton: 'लॉगिन',
      loggingIn: 'लॉगिन होत आहे...',
      errorMessage: 'अवैध यूजर ID किंवा पासवर्ड',
      footer: '© 2025 शेतकरी पोर्टल. सर्व हक्क राखीव.',
      languageLabel: 'भाषा'
    },
    gu: {
      title: 'ખેડૂત પોર્ટલ',
      subtitle: 'ચાલુ રાખવા માટે સાઇન ઇન કરો',
      userIdLabel: 'યુઝર ID',
      userIdPlaceholder: 'યુઝર ID દાખલ કરો',
      passwordLabel: 'પાસવર્ડ',
      passwordPlaceholder: 'પાસવર્ડ દાખલ કરો',
      loginButton: 'લોગિન',
      loggingIn: 'લોગિન થઈ રહ્યું છે...',
      errorMessage: 'અમાન્ય યુઝર ID અથવા પાસવર્ડ',
      footer: '© 2025 ખેડૂત પોર્ટલ. બધા અધિકારો અનામત.',
      languageLabel: 'ભાષા'
    },
    bn: {
      title: 'কৃষক পোর্টাল',
      subtitle: 'চালিয়ে যেতে সাইন ইন করুন',
      userIdLabel: 'ইউজার ID',
      userIdPlaceholder: 'ইউজার ID লিখুন',
      passwordLabel: 'পাসওয়ার্ড',
      passwordPlaceholder: 'পাসওয়ার্ড লিখুন',
      loginButton: 'লগইন',
      loggingIn: 'লগইন হচ্ছে...',
      errorMessage: 'অবৈধ ইউজার ID বা পাসওয়ার্ড',
      footer: '© 2025 কৃষক পোর্টাল। সর্বস্বত্ব সংরক্ষিত।',
      languageLabel: 'ভাষা'
    },
    pa: {
      title: 'ਕਿਸਾਨ ਪੋਰਟਲ',
      subtitle: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
      userIdLabel: 'ਯੂਜ਼ਰ ID',
      userIdPlaceholder: 'ਯੂਜ਼ਰ ID ਦਾਖਲ ਕਰੋ',
      passwordLabel: 'ਪਾਸਵਰਡ',
      passwordPlaceholder: 'ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ',
      loginButton: 'ਲਾਗਿਨ',
      loggingIn: 'ਲਾਗਿਨ ਹੋ ਰਿਹਾ ਹੈ...',
      errorMessage: 'ਗਲਤ ਯੂਜ਼ਰ ID ਜਾਂ ਪਾਸਵਰਡ',
      footer: '© 2025 ਕਿਸਾਨ ਪੋਰਟਲ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ।',
      languageLabel: 'ਭਾਸ਼ਾ'
    }
  };

  const t = translations[language];

  // Save language preference
  useEffect(() => {
    localStorage.setItem('farmerPortalLanguage', language);
  }, [language]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role: 'farmer' })
      });
      const result = await response.json();

      if (result.success) {
        onLoginSuccess({
          farmerName: result.user.name,
          farmerId: result.user.farmerId
        });
      } else {
        setError(t.errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      setError(t.errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 flex items-center justify-center px-4 relative">
      {/* Language Selector - Right Top Corner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-6 right-6 flex items-center space-x-2 bg-white rounded-lg shadow-md px-4 py-2"
      >
        <Globe className="w-5 h-5 text-green-600" />
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
          <option value="hi">हिन्दी</option>
          <option value="te">తెలుగు</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ml">മലയാളം</option>
          <option value="mr">मराठी</option>
          <option value="gu">ગુજરાતી</option>
          <option value="bn">বাংলা</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
          >
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white mt-3"></div>
              <div className="w-16 h-10 bg-green-900 rounded-t-full -mt-1"></div>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* User ID Input */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">
                {t.userIdLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={t.userIdPlaceholder}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-800 font-semibold mb-2 text-sm">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 outline-none"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t.loggingIn}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {t.loginButton}
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          {t.footer}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
