'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SGCInput from '@/components/SGCInput';
import SGCButton from '@/components/SGCButton';
import SGCCard from '@/components/SGCCard';
import { register } from '@/services/auth.service';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(fullName, email, password);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SGCCard title="Register">
        <form onSubmit={handleRegister}>
          <SGCInput
            label="Full Name"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <SGCInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <SGCInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <SGCButton type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </SGCButton>
        </form>
      </SGCCard>
    </div>
  );
};

export default RegisterPage;
