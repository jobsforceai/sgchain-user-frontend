'use client';

import React, { useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';

const RedeemTransferPage: React.FC = () => {
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
      await redeemTransfer(transferCode);
      setFormSuccess("Transfer redeemed successfully! USD has been credited to your wallet.");
      setTransferCode('');
    } catch (err) {
      // Error is already set in the store, but we can also set a form-specific one
      setFormError("Failed to redeem transfer. Please check the code and try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md">
        <SGCCard title="Redeem Sagenex Transfer">
          <p className="mb-4 text-sm text-gray-600">
            Enter the transfer code you received from the Sagenex platform to credit SGC to your wallet.
          </p>
          <form onSubmit={handleSubmit}>
            <SGCInput
              label="Transfer Code"
              id="transferCode"
              type="text"
              value={transferCode}
              onChange={(e) => setTransferCode(e.target.value)}
              required
            />
            {formError && <p className="text-red-500 text-xs italic mt-2">{formError}</p>}
            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
            {formSuccess && <p className="text-green-500 text-xs italic mt-2">{formSuccess}</p>}
            <div className="mt-6">
              <SGCButton type="submit" disabled={loading} className="w-full">
                {loading ? 'Redeeming...' : 'Redeem Transfer'}
              </SGCButton>
            </div>
          </form>
        </SGCCard>
      </div>
    </div>
  );
};

export default RedeemTransferPage;
