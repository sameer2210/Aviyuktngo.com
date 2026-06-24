import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import './index.css'; // Tailwind or global CSS

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const root = ReactDOM.createRoot(document.getElementById('root'));
const RootWrapper = import.meta.env.DEV ? React.Fragment : React.StrictMode;

const appTree = (
  <HelmetProvider>
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  </HelmetProvider>
);

const renderApp = (googleClientId) => {
  const normalizedClientId = googleClientId?.trim();

  root.render(
    <RootWrapper>
      {normalizedClientId ? (
        <GoogleOAuthProvider clientId={normalizedClientId}>
          {appTree}
        </GoogleOAuthProvider>
      ) : (
        appTree
      )}
    </RootWrapper>
  );
};

const bootstrap = async () => {
  const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  if (envClientId) {
    window.__GOOGLE_CLIENT_ID__ = envClientId;
    renderApp(envClientId);
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/google-client-id`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google Client ID from backend');
    }

    const data = await response.json();
    const backendClientId = data?.clientId?.trim() || '';
    window.__GOOGLE_CLIENT_ID__ = backendClientId;
    renderApp(backendClientId);
  } catch (error) {
    console.error('Google client id bootstrap error:', error);
    window.__GOOGLE_CLIENT_ID__ = '';
    renderApp('');
  }
};

bootstrap();
