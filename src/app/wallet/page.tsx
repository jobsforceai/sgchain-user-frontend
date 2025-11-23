'use client';

import { useEffect, useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import SGCBalanceCard from '@/components/SGCBalanceCard';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import Tabs from '@/components/Tabs';
import BuySGCForm from '@/components/dashboard/BuySGCForm';
import SellSGCForm from '@/components/dashboard/SellSGCForm';
import ExternalTransferForm from '@/components/dashboard/ExternalTransferForm';
import RedeemTransferForm from '@/components/dashboard/RedeemTransferForm';
import PinLockScreen from '@/components/wallet/PinLockScreen';

const WalletPage: React.FC = () => {
  const {
    wallet,
    walletDetails,
    pinVerifiedForDetails,
    isWalletUnlocked,
    loading,
    error,
    fetchWallet,
    fetchWalletDetails,
    clearWalletDetails,
    lockWallet,
  } = useWalletStore();

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [needsDetailsVerification, setNeedsDetailsVerification] = useState(false);

  useEffect(() => {
    // Fetch the basic wallet info on page load to check `isPinSet`
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    if (pinVerifiedForDetails) {
      fetchWalletDetails();
      setNeedsDetailsVerification(false); // Close the PIN screen
    }
  }, [pinVerifiedForDetails, fetchWalletDetails]);

  const handleViewDetailsClick = () => {
    if (walletDetails) {
      clearWalletDetails();
      setShowPrivateKey(false);
    }
    else {
      setNeedsDetailsVerification(true); // Trigger the PIN screen
    }
  };

  const tabs = [
    { label: 'Buy SGC', content: <BuySGCForm /> },
    { label: 'Sell SGC', content: <SellSGCForm /> },
    { label: 'SGTrading Transfer', content: <ExternalTransferForm /> },
    { label: 'Redeem Transfer', content: <RedeemTransferForm /> },
  ];

  const WalletDetailsView = () => (
    <div className="mt-6">
      <SGCCard title="On-Chain Wallet Details">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">On-Chain Address</label>
            <p className="font-mono bg-gray-100 p-2 rounded break-all">{walletDetails?.onchainAddress}</p>
          </div>
          {pinVerifiedForDetails && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Private Key</label>
                <div className="flex items-center gap-2">
                  <p className="font-mono bg-gray-100 p-2 rounded flex-grow break-all">
                    {showPrivateKey ? walletDetails?.privateKey : '••••••••••••••••••••••••••••••••'}
                  </p>
                  <SGCButton onClick={() => setShowPrivateKey(!showPrivateKey)}>
                    {showPrivateKey ? 'Hide' : 'Show'}
                  </SGCButton>
                </div>
              </div>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4">
                <p className="font-bold">Security Warning</p>
                <p>Never share your private key. Anyone with it can access your funds. Store it securely offline.</p>
              </div>
            </>
          )}
        </div>
      </SGCCard>
    </div>
  );

  if (!wallet) {
    return <div className="container mx-auto p-4 text-center">Loading wallet status...</div>;
  }

  // Show main lock screen if wallet isn't unlocked
  if (!isWalletUnlocked) {
    return (
      <div className="container mx-auto p-4">
        <PinLockScreen isSettingPin={!wallet.isPinSet} />
      </div>
    );
  }

  // Show details verification screen if triggered
  if (needsDetailsVerification) {
    return (
      <div className="container mx-auto p-4">
        <PinLockScreen isSettingPin={false} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Wallet</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      {loading && !wallet ? (
        <p>Loading wallet...</p>
      ) : wallet ? (
        <SGCBalanceCard balance={wallet.sgcBalance} valueUsd={wallet.sgcValueUsd} fiatBalanceUsd={wallet.fiatBalanceUsd} />
      ) : null}

      <div className="mt-6">
        <SGCButton onClick={handleViewDetailsClick} disabled={loading}>
          {walletDetails ? 'Clear & Hide Details' : 'View On-Chain Details'}
        </SGCButton>
      </div>

      {walletDetails && <WalletDetailsView />}

      <div className="mt-8">
        <SGCCard>
          <Tabs tabs={tabs} />
        </SGCCard>
      </div>
    </div>
  );
};

export default WalletPage;
