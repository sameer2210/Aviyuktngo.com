import { useState } from 'react';
import { useAdminAuth } from '../../context/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { adminAuthAPI } from '../../api/adminAuthAPI';
import AdminSidebar from './AdminSidebar';
import AdminDashboardOverview from './AdminDashboardOverview';
import AdminCategories from './AdminCategories';
import AdminImages from './AdminImages';
import AdminUsers from './AdminUsers';
import AdminPaymentHistory from './AdminPaymentHistory';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await adminAuthAPI.logout();
      logoutAdmin();
      navigate('/admin-login');
    } catch (err) {
      console.error('Logout error:', err);
      logoutAdmin();
      navigate('/admin-login');
    } finally {
      setLoggingOut(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardOverview />;
      case 'categories':
        return <AdminCategories />;
      case 'gallery':
        return <AdminImages />;
      case 'payments':
        return <AdminPaymentHistory />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminDashboardOverview />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard Overview',
      categories: 'Manage Categories',
      gallery: 'Gallery Images',
      payments: 'Payment History',
      users: 'Users Management',
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-md h-16 flex items-center px-8">
          <div className="flex-1">
            <h2 className="text-gray-800 font-semibold text-lg">{getPageTitle()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">admin@aviyukt.org</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
