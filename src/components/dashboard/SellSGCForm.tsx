'use client';

import React, { useState, useEffect } from 'react';
import useWalletStore from '@/stores/wallet.store';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';
import SGCCard from '../SGCCard';

const SellSGCForm: React.FC = () => {
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

    const amount = parseFloat(sgcAmount);
    if (isNaN(amount) || amount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    if (wallet && amount > wallet.sgcBalance) {
      setFormError("Amount exceeds your available SGC balance.");
      return;
    }

    try {
      await sellSgc(amount);
      setFormSuccess("Sell order executed successfully!");
      setSgcAmount('');
    } catch (err) {
      setFormError(error || "Sell failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <SGCCard className="mb-6" title="Available SGC Balance">
        <p className="text-2xl font-bold text-gray-800">{wallet?.sgcBalance?.toFixed(4) || '0.0000'} SGC</p>
      </SGCCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SGCInput
          label="Amount of SGC to Sell"
          type="number"
          value={sgcAmount}
          onChange={(e) => setSgcAmount(e.target.value)}
          required
        />
        {formError && <p className="text-red-500 text-sm">{formError}</p>}
        {formSuccess && <p className="text-green-500 text-sm">{formSuccess}</p>}
        <SGCButton type="submit" disabled={loading} variant="brand" className="w-full md:w-auto">
          {loading ? 'Processing...' : 'Sell SGC'}
        </SGCButton>
      </form>
    </div>
  );
};

export default SellSGCForm;
