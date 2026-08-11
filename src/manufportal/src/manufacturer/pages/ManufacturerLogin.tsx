import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Factory } from 'lucide-react';

interface ManufacturerLoginProps {
  onLogin: (manufacturerId: string) => void;
}

export function ManufacturerLogin({ onLogin }: ManufacturerLoginProps) {
  const [manufacturerId, setManufacturerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!manufacturerId.trim()) {
      setError('Please enter your Manufacturer ID');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: manufacturerId.trim(), password, role: 'manufacturer' })
      });
      const result = await response.json();

      if (result.success) {
        onLogin(result.user.userId);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className='inline-block bg-white rounded-full p-4 mb-4'
            >
              <Factory className='w-12 h-12 text-amber-600' />
            </motion.div>
            <h1 className='text-3xl font-bold text-white mb-2'>Manufacturer Portal</h1>
            <p className='text-amber-100 text-sm'>Production Management System</p>
          </div>

          {/* Form */}
          <div className='p-8'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Manufacturer ID */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Manufacturer ID
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    value={manufacturerId}
                    onChange={(e) => setManufacturerId(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                    placeholder='Enter your ID'
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all'
                    placeholder='Enter password'
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type='submit'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl'
              >
                Sign In to Portal
              </motion.button>
            </form>

            <div className='mt-6 text-center text-sm text-gray-600'>
              <p>Need help? Contact your system administrator</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='text-center mt-6 text-sm text-gray-600'>
          <p>Herbal Supply Chain Management System</p>
          <p className='text-xs mt-1'>© 2024 - Secure Production Platform</p>
        </div>
      </motion.div>
    </div>
  );
}
