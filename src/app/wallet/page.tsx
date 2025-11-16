'use client';

import React, { useEffect } from 'react';
import useWalletStore from '@/stores/wallet.store';
import { fetchWallet } from '@/services/wallet.service';
import SGCBalanceCard from '@/components/SGCBalanceCard';
import useAuthStore from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

const WalletPage: React.FC = () => {
  const { wallet, setWallet } = useWalletStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const getWallet = async () => {
      try {
        const walletData = await fetchWallet();
        setWallet(walletData);
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
          router.push('/login');
        }
        console.error('Failed to fetch wallet:', error);
      }
    };
    getWallet();
  }, [logout, router, setWallet]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Wallet</h1>
      {wallet ? (
        <SGCBalanceCard balance={wallet.sgcBalance} valueUsd={wallet.sgcValueUsd} />
      ) : (
        <p>Loading wallet...</p>
      )}
    </div>
  );
};

export default WalletPage;
