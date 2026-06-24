import { useState, useEffect } from 'react';
import { CreditCard, Search, Download, Calendar, DollarSign, Check, Clock, X } from 'lucide-react';
import axios from 'axios';
import { AdminTableLoadingState } from '../LoadingStates';

const safeText = (value) => (typeof value === 'string' ? value : '');

export default function AdminPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    successfulPayments: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setError('Admin token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payment/admin/all-payments`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const paymentData = Array.isArray(response.data) ? response.data : [];
      setPayments(paymentData);

      // Calculate stats
      const totalRevenue = paymentData.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
      const successfulPayments = paymentData.filter((p) => p?.status === 'completed').length;

      setStats({
        totalRevenue,
        totalTransactions: paymentData.length,
        successfulPayments,
      });

      applyFilters(paymentData, '', 'all');
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.response?.data?.message || 'Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters(payments, searchTerm, filterStatus);
  }, [searchTerm, filterStatus, payments]);

  const applyFilters = (data, search, status) => {
    let filtered = data;

    if (search) {
      filtered = filtered.filter(
        (payment) =>
          safeText(payment?.name).toLowerCase().includes(search.toLowerCase()) ||
          safeText(payment?.email).toLowerCase().includes(search.toLowerCase()) ||
          safeText(payment?.orderId).includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((payment) => payment?.status === status);
    }

    setFilteredPayments(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-500" size={18} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={18} />;
      case 'failed':
        return <X className="text-red-500" size={18} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
          <p className="text-gray-600 text-sm mt-1">Track all user payments and transactions</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Download size={20} />
          Export
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalTransactions}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CreditCard className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Successful Payments</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.successfulPayments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none py-2"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      {loading ? (
        <AdminTableLoadingState columns={6} />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment?._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800 font-mono text-sm">{payment?.orderId ? `${payment.orderId.slice(0, 8)}...` : 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">{payment?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{payment?.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">₹{Number(payment?.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment?.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment?.status)}`}>
                          {payment?.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {payment?.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No payments found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-medium">{filteredPayments.length}</span> of{' '}
            <span className="font-medium">{payments.length}</span> payments
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
