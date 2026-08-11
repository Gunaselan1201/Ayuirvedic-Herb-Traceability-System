import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (langCode: string) => void;
  onBack: () => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange, onBack }: LanguageSelectorProps) {
  const languages = [
    { code: 'ta', name: 'தமிழ்', nativeName: 'Tamil' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'हिन्दी', nativeName: 'Hindi' },
    { code: 'te', name: 'తెలుగు', nativeName: 'Telugu' },
    { code: 'kn', name: 'ಕನ್ನಡ', nativeName: 'Kannada' },
    { code: 'ml', name: 'മലയാളം', nativeName: 'Malayalam' },
    { code: 'mr', name: 'मराठी', nativeName: 'Marathi' },
    { code: 'gu', name: 'ગુજરાતી', nativeName: 'Gujarati' },
    { code: 'bn', name: 'বাংলা', nativeName: 'Bengali' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', nativeName: 'Punjabi' },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-cyan-200 px-6 py-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="text-gray-800 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Select Language / மொழியைத் தேர்ந்தெடுக்கவும்</h1>
        </div>
      </div>

      {/* Language List */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-3">
          {languages.map((language) => (
            <motion.button
              key={language.code}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onLanguageChange(language.code)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                currentLanguage === language.code
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-left">
                  <div className="text-2xl font-semibold text-gray-900 mb-1">
                    {language.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language.nativeName}
                  </div>
                </div>
              </div>
              {currentLanguage === language.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="bg-blue-500 text-white rounded-full p-1"
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
