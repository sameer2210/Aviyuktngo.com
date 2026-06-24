import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { adminAuthAPI } from '../api/adminAuthAPI';
import { useAdminAuth } from '../context/useAdminAuth';
import { InlineLoading } from '../Components/LoadingStates';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    try {
      setLoading(true);
      const response = await adminAuthAPI.login(username, password);
      loginAdmin(response.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Secure login required</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          {error && (
            <div className="mb-6 bg-red-500/15 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <InlineLoading label="Logging in" />
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Admin Panel
                </>
              )}
            </button>
          </form>


        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-blue-400 hover:text-blue-300 transition">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
