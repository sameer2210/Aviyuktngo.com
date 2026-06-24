import { LayoutDashboard, Grid, Images, Users, LogOut, Menu, X, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function AdminSidebar({ activeTab, setActiveTab, onLogout, sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'gallery', label: 'Gallery Images', icon: Images },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 h-screen bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-64'} w-64`}
      >
        {/* Logo Section */}
        <div className={`p-6 border-b border-blue-500 flex items-center justify-between ${collapsed ? 'flex-col gap-2' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={28} />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold">Admin</h1>
                <p className="text-sm text-blue-100">Control Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-blue-100 hover:bg-blue-500/30'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-500">
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg font-medium transition-colors ${
              collapsed ? 'px-2' : ''
            }`}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-4 top-8 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors border-4 border-gray-100"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
