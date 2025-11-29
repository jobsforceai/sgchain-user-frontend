'use client';

import React, { useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import useMarketStore from '@/stores/market.store';
import useBuyStore from '@/stores/buy.store';
import useUiStore from '@/stores/ui.store'; // Import the new UI store
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';
import SGCCard from '../SGCCard';
import { ArrowDownUp } from 'lucide-react';

const InstantBuySGCForm: React.FC = () => {
  const { wallet } = useWalletStore();
  const { livePrice } = useMarketStore();
  const { instantBuy, loading } = useBuyStore();
  const { showToast, triggerConfetti } = useUiStore(); // Get UI actions

  const [sgcAmount, setSgcAmount] = useState('');
  const [usdAmount, setUsdAmount] = useState('');

  // Local form validation error, separate from API errors
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSgcChange = (value: string) => {
    setSgcAmount(value);
    if (livePrice && value) {
      const usdValue = parseFloat(value) * livePrice;
      setUsdAmount(usdValue.toFixed(2));
    } else {
      setUsdAmount('');
    }
  };
  
  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    if (livePrice && value) {
      const sgcValue = parseFloat(value) / livePrice;
      setSgcAmount(sgcValue.toFixed(6));
    } else {
      setSgcAmount('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const amountSGC = parseFloat(sgcAmount);
    if (isNaN(amountSGC) || amountSGC <= 0) {
      setValidationError("Please enter a valid SGC amount.");
      return;
    }

    const costUSD = parseFloat(usdAmount);
    if (wallet && costUSD > wallet.fiatBalanceUsd) {
      setValidationError("Amount exceeds your available USD balance.");
      return;
    }

    try {
      const result = await instantBuy(amountSGC);
      // Use global UI store for feedback
      showToast(`Successfully bought ${result.boughtSgcAmount.toFixed(4)} SGC!`, 'success');
      triggerConfetti();
      setSgcAmount('');
      setUsdAmount('');
    } catch (err: any) {
      // API errors are now handled by the interceptor, but we catch to show toast
      showToast(err.message || "Buy failed. Please try again.", 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <SGCCard className="mb-6" title="Available USD Balance">
        <p className="text-2xl font-bold text-gray-800">${wallet?.fiatBalanceUsd?.toFixed(2) || '0.00'}</p>
      </SGCCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SGCInput
          label="USD to Spend"
          type="number"
          value={usdAmount}
          onChange={(e) => handleUsdChange(e.target.value)}
          required
        />

        <div className="flex justify-center items-center my-2">
          <ArrowDownUp size={16} className="text-gray-400" />
        </div>

        <SGCInput
          label="SGC to Receive (est.)"
          type="number"
          value={sgcAmount}
          onChange={(e) => handleSgcChange(e.target.value)}
          required
        />
        
        {livePrice && <p className="text-xs text-gray-500 text-center -mt-2">1 SGC ≈ ${livePrice.toFixed(2)} USD</p>}

        {validationError && <p className="text-red-500 text-sm mt-4">{validationError}</p>}
        
        <div className="pt-2">
          <SGCButton type="submit" disabled={loading} variant="brand" className="w-full md:w-auto">
            {loading ? 'Processing...' : 'Buy SGC Instantly'}
          </SGCButton>
        </div>
      </form>
    </div>
  );
};

export default InstantBuySGCForm;
