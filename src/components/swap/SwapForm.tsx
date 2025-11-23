'use client';

import React, { useState, useEffect } from 'react';
import useSwapStore from '@/stores/swap.store';
import useWalletStore from '@/stores/wallet.store';
import useTokenStore from '@/stores/token.store';
import SGCInput from '../SGCInput';
import SGCButton from '../SGCButton';
import { TokenLaunch } from '@/services/token.service';

const SwapForm: React.FC = () => {
  const { quote, loading, error, fetchQuote, performSwap, swapResult, clearResult } = useSwapStore();
  const { wallet, verifyPin, pinVerifiedForDetails, clearWalletDetails } = useWalletStore();
  const { tokens, fetchTokens } = useTokenStore();

  const [tokenIn, setTokenIn] = useState('SGC');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokens(); // Fetch user's custom tokens for the dropdown
  }, [fetchTokens]);

  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      const timeoutId = setTimeout(() => {
        fetchQuote({ tokenIn, tokenOut, amountIn });
      }, 500); // Debounce to avoid excessive API calls
      return () => clearTimeout(timeoutId);
    }
  }, [amountIn, tokenIn, tokenOut, fetchQuote]);

  useEffect(() => {
    // If PIN verification is successful, proceed with the swap
    if (pinVerifiedForDetails) {
      setShowPinModal(false);
      handlePerformSwap();
    }
  }, [pinVerifiedForDetails]);

  const handleSwapClick = () => {
    clearResult();
    setShowPinModal(true);
  };
  
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    try {
      await verifyPin(pinInput);
      // The useEffect for pinVerified will trigger the swap
    } catch (err: any) {
      setModalError(err.message || "Invalid PIN");
    } finally {
      setPinInput('');
    }
  };

  const handlePerformSwap = async () => {
    try {
      await performSwap({ tokenIn, tokenOut, amountIn });
    } finally {
      clearWalletDetails(); // Clear the sensitive wallet token
    }
  };

  const availableTokens = [
    { _id: 'SGC', metadata: { symbol: 'SGC', name: 'SGCoin' } },
    ...tokens.filter(t => t.status === 'DEPLOYED'),
  ];

  const PinModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <form onSubmit={handlePinSubmit}>
          <SGCInput label="Enter PIN to Confirm Swap" type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} maxLength={4} required />
          {modalError && <p className="text-red-500 text-xs">{modalError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <SGCButton type="button" onClick={() => setShowPinModal(false)} className="bg-gray-300">Cancel</SGCButton>
            <SGCButton type="submit">Confirm</SGCButton>
          </div>
       </form>
    </div>
  );

  return (
    <div>
      {showPinModal && <PinModal />}
      <div className="space-y-4">
        <SGCInput 
          label="From" 
          type="select" 
          value={tokenIn}
          onChange={e => setTokenIn(e.target.value)}
          options={availableTokens.map(t => ({ value: t._id === 'SGC' ? 'SGC' : (t as TokenLaunch).onchainData!.tokenAddress, label: t.metadata.symbol }))}
        />
        <SGCInput 
          label="Amount" 
          type="number" 
          value={amountIn} 
          onChange={e => setAmountIn(e.target.value)} 
          placeholder="0.0"
        />
        <SGCInput 
          label="To" 
          type="select" 
          value={tokenOut}
          onChange={e => setTokenOut(e.target.value)}
          options={availableTokens.map(t => ({ value: t._id === 'SGC' ? 'SGC' : (t as TokenLaunch).onchainData!.tokenAddress, label: t.metadata.symbol }))}
        />
        <SGCInput 
          label="Estimated Amount Out" 
          type="text" 
          value={quote?.amountOut || ''} 
          disabled 
          placeholder="0.0"
        />
      </div>

      <div className="mt-6">
        <SGCButton onClick={handleSwapClick} disabled={loading || !amountIn || !tokenIn || !tokenOut} className="w-full">
          {loading ? 'Processing...' : 'Swap'}
        </SGCButton>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {swapResult && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
          <p><strong>Swap Successful!</strong></p>
          <p>Transaction Hash: {swapResult.txHash}</p>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
