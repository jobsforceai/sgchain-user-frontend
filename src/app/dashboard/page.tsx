"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

import SGCBalanceCard from '@/components/SGCBalanceCard';
import SGCCard from '@/components/SGCCard';
import Tabs from '@/components/Tabs';
import HistoryTab from '@/components/dashboard/HistoryTab';
import LiveTransactions from '@/components/dashboard/LiveTransactions';
import AnimateGSAP from '@/components/AnimateGSAP';
import useAuthStore from '@/stores/auth.store';
import useWalletStore from '@/stores/wallet.store';

// Dynamically import the chart component with SSR disabled
const SGCPriceChart = dynamic(() => import('@/components/dashboard/SGCPriceChart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

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
    <div className="w-full px-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-8">
        <AnimateGSAP>
          {wallet ? (
            <SGCBalanceCard balance={wallet.sgcBalance} valueUsd={wallet.sgcValueUsd} fiatBalanceUsd={wallet.fiatBalanceUsd} />
          ) : (
            <p>Loading wallet...</p>
          )}
        </AnimateGSAP>
      </div>

      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <AnimateGSAP>
          <div className="w-full h-full">
            <LiveTransactions />
          </div>
        </AnimateGSAP>

        <AnimateGSAP>
          <div className="w-full h-full">
            <SGCCard title="SGC Price (USD)" className="sgc-glass rounded-xl h-full">
              <SGCPriceChart height={384} />
            </SGCCard>
          </div>
        </AnimateGSAP>
      </div>

      <AnimateGSAP>
        <SGCCard>
          <Tabs tabs={tabs} />
        </SGCCard>
      </AnimateGSAP>
      
    </div>
  );
};

export default DashboardPage;
