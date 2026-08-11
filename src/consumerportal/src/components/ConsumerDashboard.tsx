import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConsumerDashboard() {
  const [batchId, setBatchId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId.trim()) {
      setError('Please enter a Batch ID');
      return;
    }
    setError('');
    navigate(`/timeline/${batchId.trim()}`);
  };

  const handleQRScan = () => {
    // In a real implementation, this would open the camera for QR scanning
    alert('QR Scanner would open here. For demo, please enter Batch ID manually.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌿 HERB Product Tracker
            </h1>
            <p className="text-lg text-gray-600">
              Trace your herbal products from farm to shelf
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Enter Product Batch ID
              </h2>
              <p className="text-gray-600">
                Scan QR code or enter the batch ID manually
              </p>
            </div>

            {/* QR Scan Button */}
            <div className="mb-6">
              <button
                onClick={handleQRScan}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>📱</span>
                <span>Scan QR Code</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Manual Entry Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch ID
                </label>
                <input
                  type="text"
                  id="batchId"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  placeholder="e.g., SURTN1201NE"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200"
              >
                Track Product
              </button>
            </form>

            {/* Example Batch IDs */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Example Batch IDs:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>SURTN1201NE - Neem from Tamil Nadu</div>
                <div>RAMKL1502TU - Tulsi from Kerala</div>
                <div>KIRKA2003AV - Aloe Vera from Karnataka</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>Powered by HERB Blockchain Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
}

