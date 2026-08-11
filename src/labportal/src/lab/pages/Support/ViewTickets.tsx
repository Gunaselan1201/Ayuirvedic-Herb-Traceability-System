import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  AlertCircle,
  CheckCircle,
  Clock,
  FileWarning,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  ExternalLink
} from 'lucide-react';

interface ViewTicketsProps {
  session: { labId: string } | null;
}

interface Ticket {
  ticketId: string;
  labId: string;
  userName: string;
  issueType: string;
  description: string;
  severity: string;
  attachment: string | null;
  status: string;
  timestamp: string;
  createdAt: string;
  adminNotes?: string;
}

export function ViewTickets({ session }: ViewTicketsProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [session]);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, statusFilter, severityFilter]);

  const fetchTickets = async () => {
    if (!session?.labId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5174/api/support/tickets?labId=${session.labId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      alert('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== 'All') {
      filtered = filtered.filter((ticket) => ticket.severity === severityFilter);
    }

    setFilteredTickets(filtered);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
      Resolved: 'bg-green-100 text-green-800 border-green-300',
      Closed: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

  const getSeverityBadge = (severity: string) => {
    const badges = {
      Low: 'bg-green-100 text-green-800 border-green-300',
      Medium: 'bg-orange-100 text-orange-800 border-orange-300',
      High: 'bg-red-100 text-red-800 border-red-300'
    };
    return badges[severity as keyof typeof badges] || badges.Medium;
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'High') return <AlertCircle className="w-5 h-5" />;
    if (severity === 'Low') return <CheckCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: 'Noto Sans, sans-serif' }}
                >
                  Support Tickets
                </h1>
                <p className="text-gray-600">View and track your reported issues</p>
              </div>
            </div>
            <a
              href="/lab/support/report"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg flex items-center gap-2"
            >
              <FileWarning className="w-5 h-5" />
              Report New Issue
            </a>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Severity Filter */}
              <div>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All Severities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredTickets.length} of {tickets.length} tickets
            </div>
          </div>
        </motion.div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
          >
            <FileWarning className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'All' || severityFilter !== 'All'
                ? 'Try adjusting your filters'
                : 'You haven\'t reported any issues yet'}
            </p>
            <a
              href="/lab/support/report"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <FileWarning className="w-5 h-5" />
              Report First Issue
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket.ticketId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() =>
                    setExpandedTicket(
                      expandedTicket === ticket.ticketId ? null : ticket.ticketId
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${getSeverityBadge(ticket.severity)}`}>
                        {getSeverityIcon(ticket.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-semibold text-blue-600">
                            {ticket.ticketId}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadge(ticket.severity)}`}>
                            {ticket.severity}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {ticket.issueType}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedTicket === ticket.ticketId && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 pt-4 mt-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Ticket Information
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Reported by:</span>
                                <span className="font-medium">{ticket.userName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Lab ID:</span>
                                <span className="font-medium">{ticket.labId}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Submitted:</span>
                                <span className="font-medium">{formatDate(ticket.timestamp)}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">
                              Full Description
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {ticket.description}
                            </p>
                          </div>
                        </div>

                        {ticket.attachment && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Attachment
                            </h4>
                            <a
                              href={`http://localhost:5174${ticket.attachment}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Attachment
                            </a>
                          </div>
                        )}

                        {ticket.adminNotes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">
                              Admin Notes
                            </h4>
                            <p className="text-sm text-blue-800">{ticket.adminNotes}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
