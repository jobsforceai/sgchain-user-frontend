'use client';

import React, { useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';

const RedeemTransferForm: React.FC = () => {
  const { redeemTransfer, loading, error } = useWalletStore();
  const [transferCode, setTransferCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!transferCode) {
      setFormError("Please enter a transfer code.");
      return;
    }

    try {
      const { creditedUsdAmount } = await redeemTransfer(transferCode);
      if (creditedUsdAmount) {
        setFormSuccess(`Successfully redeemed $${creditedUsdAmount.toFixed(2)} USD!`);
      } else {
        setFormSuccess("Transfer redeemed successfully!");
      }
      setTransferCode('');
    } catch (err) {
      setFormError(error || "Failed to redeem transfer.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
        <p className="mb-4 text-sm text-gray-600">
            Enter the transfer code you received from SGTrading or Sagenex to credit funds to your wallet.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <SGCInput
                label="Transfer Code"
                type="text"
                value={transferCode}
                onChange={(e) => setTransferCode(e.target.value)}
                placeholder="e.g., SGT-USD-XXXX-XXXX"
                required
            />
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {formSuccess && <p className="text-green-500 text-sm">{formSuccess}</p>}
            <SGCButton type="submit" disabled={loading} variant="brand" className="w-full md:w-auto">
              {loading ? 'Redeeming...' : 'Redeem Transfer'}
            </SGCButton>
        </form>
    </div>
  );
};

export default RedeemTransferForm;