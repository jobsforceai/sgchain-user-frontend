'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SGCInput from '@/components/SGCInput';
import SGCButton from '@/components/SGCButton';
import SGCCard from '@/components/SGCCard';
import { register } from '@/services/auth.service';
import AnimateGSAP from '@/components/AnimateGSAP';
import Image from 'next/image';
import Link from 'next/link';

const calculateStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/\d/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 4) return { label: 'Strong', color: 'text-green-500' };
  if (score >= 2) return { label: 'Good', color: 'text-yellow-500' };
  return { label: 'Weak', color: 'text-red-500' };
};

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordStrength = useMemo(() => calculateStrength(password), [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
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
    <div className="min-h-screen flex items-center bg-linear-to-b from-white to-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <AnimateGSAP className="flex justify-center">
            <SGCCard title="Create an Account" className="w-full max-w-md">
              <form onSubmit={handleRegister} className="space-y-6">
                <div data-gsap>
                  <SGCInput
                    label="Full Name"
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div data-gsap>
                  <SGCInput
                    label="Email"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@company.com"
                  />
                </div>

                <div data-gsap className="relative">
                  <SGCInput
                    label="Password"
                    id="password"
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter a strong password"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-9 text-sm text-slate-400">{show ? 'Hide' : 'Show'}</button>
                </div>

                <div data-gsap>
                  <SGCInput
                    label="Confirm Password"
                    id="confirm"
                    type={show ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    placeholder="Confirm your password"
                  />
                </div>

                <div className="text-sm text-slate-500">Password strength: <span className={`font-medium ${passwordStrength.color}`}>{passwordStrength.label}</span></div>

                {error && <p className="text-red-500 text-xs italic">{error}</p>}

                <div data-gsap>
                  <SGCButton type="submit" disabled={loading} className="w-full">
                    {loading ? 'Registering...' : 'Create Account'}
                  </SGCButton>
                </div>

                <div className="mt-4 text-sm text-slate-500">Already have an account? <Link href="/login" className="underline font-medium">Login</Link></div>
              </form>
            </SGCCard>
          </AnimateGSAP>

          <AnimateGSAP className="hidden md:flex flex-col items-start gap-6 pl-6">
            <div data-gsap className="mt-6 w-full">
              <Image src="/register.png" alt="illustration" width={400} height={360} className="object-contain" />
            </div>
          </AnimateGSAP>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;