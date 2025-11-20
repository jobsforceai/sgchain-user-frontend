'use client';

import React, { useEffect, useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';

const SellSGCPage: React.FC = () => {
  const { wallet, sellSgc, loading, error, fetchWallet } = useWalletStore();
  const [sgcAmount, setSgcAmount] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!sgcAmount || parseFloat(sgcAmount) <= 0) {
      setFormError("Please enter a valid SGC amount.");
      return;
    }

    try {
      await sellSgc(parseFloat(sgcAmount));
      setFormSuccess("Sell order executed successfully!");
      setSgcAmount('');
    } catch (err) {
      setFormError("Sell failed. Please check your balance and try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md">
        <SGCCard title="Sell SGC">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Your available SGC Balance:</p>
              <p className="text-2xl font-bold">{wallet?.sgcBalance?.toFixed(4) || '0.0000'} SGC</p>
            </div>
            <SGCInput
              label="Amount of SGC to Sell"
              id="sgcAmount"
              type="number"
              value={sgcAmount}
              onChange={(e) => setSgcAmount(e.target.value)}
              required
            />
            {formError && <p className="text-red-500 text-xs italic mt-2">{formError}</p>}
            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
            {formSuccess && <p className="text-green-500 text-xs italic mt-2">{formSuccess}</p>}
            <div className="mt-6">
              <SGCButton type="submit" disabled={loading} className="w-full">
                {loading ? 'Selling...' : 'Sell SGC'}
              </SGCButton>
            </div>
          </form>
        </SGCCard>
      </div>
    </div>
  );
};

export default SellSGCPage;
