'use client';

import { useEffect, useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import SGCBalanceCard from '@/components/SGCBalanceCard';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';
import axios from 'axios';

const WalletPage: React.FC = () => {
  const {
    wallet,
    walletDetails,
    pinVerified,
    loading,
    error,
    fetchWallet,
    setPin,
    verifyPin,
    fetchWalletDetails,
    clearWalletDetails,
  } = useWalletStore();

  const [showPinModal, setShowPinModal] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  useEffect(() => {
    if (pinVerified) {
      setShowPinModal(false);
      fetchWalletDetails();
    }
  }, [pinVerified, fetchWalletDetails]);

  const handleViewDetailsClick = () => {
    if (walletDetails) {
      clearWalletDetails();
      setShowPrivateKey(false);
      return;
    }
    
    if (wallet?.isPinSet) {
      setIsSettingPin(false);
    } else {
      setIsSettingPin(true);
    }
    setShowPinModal(true);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    if (!/^\d{4}$/.test(pinInput)) {
      setModalError("PIN must be exactly 4 digits.");
      return;
    }
    try {
      if (isSettingPin) {
        await setPin(pinInput);
        setIsSettingPin(false); // Switch to verification mode
        // After setting the PIN, we need to re-fetch the wallet to get the updated isPinSet flag
        await fetchWallet();
      } else {
        await verifyPin(pinInput);
      }
      setPinInput(''); // Clear PIN input on success
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      setModalError(errorMessage);
    }
  };

  const PinModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SGCCard title={isSettingPin ? "Set Wallet PIN" : "Verify PIN to Continue"}>
        <form onSubmit={handlePinSubmit}>
          <p className="mb-4 text-sm text-gray-600">
            {isSettingPin
              ? "Create a 4-digit PIN to secure your wallet details."
              : "Enter your 4-digit PIN to view sensitive details."}
          </p>
          <SGCInput
            label="4-Digit PIN"
            id="pin"
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            maxLength={4}
            required
          />
          {modalError && <p className="text-red-500 text-xs italic mt-2">{modalError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <SGCButton type="button" onClick={() => { setShowPinModal(false); setModalError(null); setIsSettingPin(false); }} disabled={loading} className="bg-gray-300 hover:bg-gray-400">
              Cancel
            </SGCButton>
            <SGCButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : (isSettingPin ? 'Set PIN' : 'Verify')}
            </SGCButton>
          </div>
        </form>
      </SGCCard>
    </div>
  );

  const WalletDetailsView = () => (
    <div className="mt-6">
      <SGCCard title="On-Chain Wallet Details">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">On-Chain Address</label>
            <p className="font-mono bg-gray-100 p-2 rounded break-all">{walletDetails?.onchainAddress}</p>
          </div>
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
        </div>
      </SGCCard>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {showPinModal && <PinModal />}
      <h1 className="text-3xl font-bold mb-4">Wallet</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
      {wallet ? (
        <SGCBalanceCard balance={wallet.sgcBalance} valueUsd={wallet.sgcValueUsd} fiatBalanceUsd={wallet.fiatBalanceUsd} />
      ) : loading ? (
        <p>Loading wallet...</p>
      ) : null}

      <div className="mt-6">
        <SGCButton onClick={handleViewDetailsClick} disabled={loading}>
          {walletDetails ? 'Clear & Hide Details' : 'View On-Chain Details'}
        </SGCButton>
      </div>

      {loading && !wallet && <p>Loading details...</p>}
      {walletDetails && <WalletDetailsView />}
    </div>
  );
};

export default WalletPage;
