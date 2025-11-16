'use client';

import React, { useEffect } from 'react';
import useWalletStore from '@/stores/wallet.store';
import useMarketStore from '@/stores/market.store';
import { fetchWallet } from '@/services/wallet.service';
import { getSgcPrice } from '@/services/market.service';
import SGCBalanceCard from '@/components/SGCBalanceCard';
import SGCPriceTag from '@/components/SGCPriceTag';
import SGCButton from '@/components/SGCButton';
import useAuthStore from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

const DashboardPage: React.FC = () => {
  const { wallet, setWallet } = useWalletStore();
  const { sgcPrice, setSgcPrice } = useMarketStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [walletData, priceData] = await Promise.all([fetchWallet(), getSgcPrice()]);
      setWallet(walletData);
      setSgcPrice(priceData);
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
        router.push('/login');
      }
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <SGCButton onClick={handleLogout}>Logout</SGCButton>
      </div>

      {wallet ? (
        <SGCBalanceCard balance={wallet.sgcBalance} valueUsd={wallet.sgcValueUsd} />
      ) : (
        <p>Loading wallet...</p>
      )}

      <div className="mt-4">
        {sgcPrice ? (
          <SGCPriceTag price={sgcPrice.priceUsd} symbol={sgcPrice.symbol} />
        ) : (
          <p>Loading price...</p>
        )}
      </div>
      
      <div className="mt-4">
        <SGCButton onClick={fetchData}>Refresh</SGCButton>
      </div>
    </div>
  );
};

export default DashboardPage;
