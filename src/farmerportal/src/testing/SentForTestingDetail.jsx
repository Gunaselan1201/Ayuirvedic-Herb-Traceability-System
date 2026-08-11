import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, User, MapPin, Calendar, Truck, FlaskConical, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const SentForTestingDetail = ({ batchId, onBack }) => {
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatchDetail = async () => {
      try {
        const resp = await fetch(`http://localhost:3001/events/${batchId}`);
        if (!resp.ok) throw new Error('Failed to fetch batch details');
        const events = await resp.json();
        
        // Find the farmer stage event
        const farmerEvent = events.find(e => e.stage === 'farmer');
        
        if (farmerEvent) {
          setBatchData({
            id: farmerEvent.batchId,
            productName: farmerEvent.data.productName || 'Unknown',
            quantity: farmerEvent.data.quantity || 'N/A',
            harvestDate: farmerEvent.data.harvestedDate || 'N/A',
            sentDate: new Date(farmerEvent.timestamp).toLocaleDateString('en-GB'),
            farmer: {
              name: farmerEvent.addedBy || 'Unknown',
              id: farmerEvent.data.farmerId || 'N/A',
              location: farmerEvent.data.location || 'Unknown',
              contact: '+91 98765 43210'
            },
            transport: {
              status: 'Sent for Testing',
              vehicleNumber: 'N/A',
              driverName: 'N/A',
              driverContact: 'N/A',
              startedOn: new Date(farmerEvent.timestamp).toLocaleString('en-GB'),
              expectedArrival: 'TBD',
              currentLocation: farmerEvent.data.location || 'Unknown'
            },
            lab: {
              name: 'Quality Testing Lab',
              location: 'Lab Location',
              contact: 'N/A',
              email: 'lab@test.com'
            },
            testingStatus: {
              received: false,
              receivedDate: null,
              testingStarted: false,
              testingStartDate: null,
              expectedCompletionDate: 'TBD'
            }
          });
        }
      } catch (error) {
        console.error('Error fetching batch details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (batchId) {
      fetchBatchDetail();
    }
  }, [batchId]);

  if (loading) {
    return <div className="min-h-screen bg-white p-6"><div className="text-center py-8">Loading batch details...</div></div>;
  }

  if (!batchData) {
    return <div className="min-h-screen bg-white p-6"><div className="text-center py-8">Batch not found</div></div>;
  }

  const timeline = [
    { 
      title: 'Batch Created', 
      date: '2024-10-15 10:30 AM', 
      status: 'completed',
      icon: Package,
      description: 'Batch registered in system'
    },
    { 
      title: 'Sent for Testing', 
      date: '2024-10-28 08:00 AM', 
      status: 'completed',
      icon: Truck,
      description: 'Dispatched to testing facility'
    },
    { 
      title: 'In Transit', 
      date: '2024-10-28 08:30 AM', 
      status: 'active',
      icon: Truck,
      description: 'On the way to lab'
    },
    { 
      title: 'Receive at Lab', 
      date: 'Pending', 
      status: 'pending',
      icon: MapPin,
      description: 'Arrival at testing facility'
    },
    { 
      title: 'Testing Begins', 
      date: 'Pending', 
      status: 'pending',
      icon: FlaskConical,
      description: 'Laboratory testing process'
    },
    { 
      title: 'Results Ready', 
      date: 'Expected: 2024-10-30', 
      status: 'pending',
      icon: CheckCircle,
      description: 'Test results and grading'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to List
        </button>
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-600">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{batchData.id}</h1>
              <p className="text-xl text-gray-600 mb-1">{batchData.productName}</p>
              <p className="text-sm text-gray-500">Quantity: {batchData.quantity}</p>
            </div>
            <div className="text-right">
              <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                {batchData.transport.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Farmer Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Farmer Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Farmer Name</p>
                <p className="font-semibold text-gray-800">{batchData.farmer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Farmer ID</p>
                <p className="font-semibold text-gray-800">{batchData.farmer.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-800">{batchData.farmer.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact</p>
                <p className="font-semibold text-gray-800">{batchData.farmer.contact}</p>
              </div>
            </div>
          </motion.div>

          {/* Transport Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Truck className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Transport Details</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Status</p>
                  <p className="font-bold text-yellow-700">{batchData.transport.status}</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-600">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Live Tracking</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Vehicle Number</p>
                  <p className="font-semibold text-gray-800">{batchData.transport.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Driver Name</p>
                  <p className="font-semibold text-gray-800">{batchData.transport.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Started On</p>
                  <p className="font-semibold text-gray-800">{batchData.transport.startedOn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Arrival</p>
                  <p className="font-semibold text-gray-800">{batchData.transport.expectedArrival}</p>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">{batchData.transport.currentLocation}</span>
              </div>
            </div>
          </motion.div>

          {/* Lab Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FlaskConical className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Laboratory Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Lab Name</p>
                <p className="font-semibold text-gray-800">{batchData.lab.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-semibold text-gray-800">{batchData.lab.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact</p>
                <p className="font-semibold text-gray-800">{batchData.lab.contact}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-semibold text-gray-800">{batchData.lab.email}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-md sticky top-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Status Timeline</h2>
            <div className="space-y-4">
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative">
                    {index < timeline.length - 1 && (
                      <div className={`absolute left-4 top-10 w-0.5 h-full ${
                        item.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                      }`} />
                    )}
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.status === 'completed' ? 'bg-green-100' :
                        item.status === 'active' ? 'bg-yellow-100 animate-pulse' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          item.status === 'completed' ? 'text-green-600' :
                          item.status === 'active' ? 'text-yellow-600' :
                          'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${
                          item.status === 'completed' || item.status === 'active' ? 'text-gray-800' : 'text-gray-400'
                        }`}>{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SentForTestingDetail;
