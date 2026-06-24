import React, { useEffect, useState } from 'react';
import { GoogleLogin as GoogleOAuthButton, GoogleOAuthProvider } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, isSigningIn, authError, setAuthError } = useAuth();
  const [localError, setLocalError] = useState('');
  const [googleClientId, setGoogleClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || window.__GOOGLE_CLIENT_ID__?.trim() || ''
  );
  const [isClientIdLoading, setIsClientIdLoading] = useState(() => {
    return !(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || window.__GOOGLE_CLIENT_ID__?.trim());
  });

  const fallbackPath = '/';
  const redirectPath = location.state?.from?.pathname || fallbackPath;

  useEffect(() => {
    if (googleClientId) {
      window.__GOOGLE_CLIENT_ID__ = googleClientId;
      return undefined;
    }

    let isActive = true;

    const loadGoogleClientId = async () => {
      setIsClientIdLoading(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/auth/google-client-id`, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to load Google Client ID');
        }

        const data = await response.json();
        const nextClientId = data?.clientId?.trim() || '';

        if (!isActive || !nextClientId) {
          return;
        }

        window.__GOOGLE_CLIENT_ID__ = nextClientId;
        setGoogleClientId(nextClientId);
      } catch (error) {
        if (isActive) {
          console.error('Google client id load error:', error);
        }
      } finally {
        if (isActive) {
          setIsClientIdLoading(false);
        }
      }
    };

    loadGoogleClientId();

    return () => {
      isActive = false;
    };
  }, [googleClientId]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLocalError('');

    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setLocalError('Google did not return a valid credential.');
      return;
    }

    const result = await signInWithGoogle(idToken);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleGoogleError = () => {
    setAuthError('');
    setLocalError('Google sign-in was cancelled or failed.');
  };

  return (
    <div className="w-full max-w-md lg:ml-8 bg-white rounded-2xl shadow-lg border border-[#d7deee] p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-serif text-[#335288] text-center mb-3">Welcome to Aviyukt NGO</h1>
      <p className="text-sm sm:text-base text-gray-600 text-center mb-6">
        Continue with your Google account to access your profile and services.
      </p>

      {!googleClientId ? (
        isClientIdLoading ? (
          <p className="text-sm text-[#335288] bg-blue-50 border border-blue-200 rounded-md p-3 text-center">
            Preparing Google sign-in...
          </p>
        ) : (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
            Missing Google Client ID. Please set `GOOGLE_CLIENT_ID` in backend and restart backend + frontend.
          </p>
        )
      ) : (
        <GoogleOAuthProvider clientId={googleClientId}>
          <div className="flex justify-center">
            <GoogleOAuthButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="continue_with"
              shape="pill"
              theme="outline"
              size="large"
              width="300"
            />
          </div>
        </GoogleOAuthProvider>
      )}

      {isSigningIn && (
        <p className="mt-4 text-sm text-[#335288] text-center">Signing you in, please wait...</p>
      )}
      {(localError || authError) && (
        <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 text-center">
          {localError || authError}
        </p>
      )}
    </div>
  );
};

export default GoogleLogin;
