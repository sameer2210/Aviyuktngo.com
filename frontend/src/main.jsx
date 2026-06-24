import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const RootWrapper = import.meta.env.DEV ? React.Fragment : React.StrictMode;
const envGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

if (envGoogleClientId) {
  window.__GOOGLE_CLIENT_ID__ = envGoogleClientId;
}

root.render(
  <RootWrapper>
    <HelmetProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AdminAuthProvider>
      </AuthProvider>
    </HelmetProvider>
  </RootWrapper>
);
