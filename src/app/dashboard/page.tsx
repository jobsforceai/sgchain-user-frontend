'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import SGCBalanceCard from '@/components/SGCBalanceCard';
import SGCCard from '@/components/SGCCard';
import Tabs from '@/components/Tabs';
import HistoryTab from '@/components/dashboard/HistoryTab';
import LiveTransactions from '@/components/dashboard/LiveTransactions';
import useAuthStore from '@/stores/auth.store';
import useWalletStore from '@/stores/wallet.store';

const DashboardPage: React.FC = () => {
  const { wallet, fetchWallet } = useWalletStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchWallet();
      } catch (error: any) {
        if (error.response?.status === 401) {
          logout();
          router.push('/login');
        }
        console.error('Failed to fetch wallet data:', error);
      }
    };
    fetchData();
  }, [fetchWallet, logout, router]);

  const tabs = [
    { label: 'History', content: <HistoryTab /> },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        {wallet ? (
          <SGCBalanceCard balance={wallet.sgcBalance} valueUsd={wallet.sgcValueUsd} fiatBalanceUsd={wallet.fiatBalanceUsd} />
        ) : (
          <p>Loading wallet...</p>
        )}
      </div>

      <div className="mb-8">
        <LiveTransactions />
      </div>

      <SGCCard>
        <Tabs tabs={tabs} />
      </SGCCard>
      
    </div>
  );
};

export default DashboardPage;
