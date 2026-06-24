import { createContext, useState, useEffect } from 'react';

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists in localStorage on mount
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
      setIsAdminLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const loginAdmin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAdminLoggedIn(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsAdminLoggedIn(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        isAdminLoggedIn,
        loading,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
