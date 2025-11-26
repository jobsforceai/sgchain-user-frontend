'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/auth.store';
import Cookies from 'js-cookie';

const AuthInitializer = () => {
  const { setToken, setAuthInitialized } = useAuthStore();

  useEffect(() => {
    const token = Cookies.get('sgchain_access_token');
    if (token) {
      setToken(token);
    }
    setAuthInitialized(true);
  }, [setToken, setAuthInitialized]);

  return null; // This component does not render anything
};

export default AuthInitializer;
