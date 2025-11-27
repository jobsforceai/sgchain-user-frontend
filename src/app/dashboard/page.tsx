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
import useMarketStore from '@/stores/market.store';

const SGCPriceChart = dynamic(() => import('@/components/dashboard/SGCPriceChart'), {
  ssr: false,
  loading: () => <div style={{ height: 384 }} className="flex items-center justify-center"><p>Loading chart...</p></div>
});

const DashboardPage: React.FC = () => {
  const { wallet, fetchWallet } = useWalletStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const { livePrice, fetchHistoricalData, subscribeToLiveUpdates, unsubscribeFromLiveUpdates } = useMarketStore();

  useEffect(() => {
    fetchWallet().catch((error: any) => {
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
      console.error('Failed to fetch wallet data:', error);
    });
  }, [fetchWallet, logout, router]);

  useEffect(() => {
    const symbol = 'sgc';
    fetchHistoricalData(symbol);
    subscribeToLiveUpdates(symbol);

    return () => {
      unsubscribeFromLiveUpdates(symbol);
    };
  }, [fetchHistoricalData, subscribeToLiveUpdates, unsubscribeFromLiveUpdates]);

  const tabs = [
    { label: 'History', content: <HistoryTab /> },
  ];

  const chartTitle = (
    <div className="flex items-center gap-4">
      <span>SGC Price (USD)</span>
      {livePrice && (
        <span className="text-lg font-mono bg-green-100 text-green-800 px-2 py-1 rounded">
          ${livePrice}
        </span>
      )}
    </div>
  );

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
            <SGCCard title={chartTitle} className="sgc-glass rounded-xl h-full">
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