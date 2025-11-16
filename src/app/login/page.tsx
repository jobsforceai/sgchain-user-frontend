'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SGCInput from '@/components/SGCInput';
import SGCButton from '@/components/SGCButton';
import SGCCard from '@/components/SGCCard';
import { requestOtp } from '@/services/auth.service';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await requestOtp(email);
      router.push(`/otp?email=${email}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SGCCard title="Login">
        <form onSubmit={handleLogin}>
          <SGCInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <SGCButton type="submit" disabled={loading}>
            {loading ? 'Requesting OTP...' : 'Request OTP'}
          </SGCButton>
        </form>
      </SGCCard>
    </div>
  );
};

export default LoginPage;
