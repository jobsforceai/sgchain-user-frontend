'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SGCInput from '@/components/SGCInput';
import SGCButton from '@/components/SGCButton';
import SGCCard from '@/components/SGCCard';
import { loginWithOtp } from '@/services/auth.service';
import useAuthStore from '@/stores/auth.store';
import Cookies from 'js-cookie';
import axios from 'axios';

const OtpPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { setToken } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email not found.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { accessToken } = await loginWithOtp(email, otp);
      setToken(accessToken);
      Cookies.set('sgchain_access_token', accessToken, { expires: 1 }); // Expires in 1 day
      router.push('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An unexpected error occurred.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SGCCard title="Enter OTP">
        <form onSubmit={handleOtpLogin}>
          <p className="mb-4">An OTP has been sent to {email}</p>
          <SGCInput
            label="OTP"
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <SGCButton type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </SGCButton>
        </form>
      </SGCCard>
    </div>
  );
};

const OtpPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OtpPageContent />
  </Suspense>
);

export default OtpPage;
