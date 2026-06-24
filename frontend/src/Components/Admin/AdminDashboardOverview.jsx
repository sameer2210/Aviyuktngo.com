import { useEffect, useState } from 'react';
import { Grid, Images, Users, DollarSign } from 'lucide-react';
import { categoryAPI, imageAPI } from '../../api/adminAPI';
import axios from 'axios';
import SkeletonBlock from '../LoadingStates';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalImages: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        // Fetch categories and images
        const [categoriesRes, imagesRes, paymentsRes] = await Promise.all([
          categoryAPI.getAll(),
          imageAPI.getAll(),
          axios.get(`${import.meta.env.VITE_API_URL}/api/payment/admin/all-payments`, {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        ]);

        const payments = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];
        const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        setStats({
          totalCategories: categoriesRes.data?.length || 0,
          totalImages: imagesRes.data?.length || 0,
          totalUsers: payments.length > 0 ? [...new Set(payments.map((p) => p.email))].length : 0,
          totalRevenue,
          totalTransactions: payments.length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Categories',
      value: stats.totalCategories,
      icon: Grid,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Images',
      value: stats.totalImages,
      icon: Images,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
      subtitle: `(${stats.totalTransactions} transactions)`,
      icon: DollarSign,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4" role="status" aria-live="polite" aria-label="Loading dashboard">
        <span className="sr-only">Loading dashboard</span>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonBlock key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, Admin! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your gallery today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                  {card.subtitle && <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>}
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Updated just now</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            + Add Category
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            + Upload Images
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
