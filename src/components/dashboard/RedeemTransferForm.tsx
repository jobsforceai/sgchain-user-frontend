'use client';

import React, { useState } from 'react';
import useWalletStore from '@/stores/wallet.store';
import useUiStore from '@/stores/ui.store';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';

const RedeemTransferForm: React.FC = () => {
  const { redeemTransfer, loading, error } = useWalletStore();
  const { showToast, triggerConfetti } = useUiStore();
  const [transferCode, setTransferCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!transferCode) {
      setFormError("Please enter a transfer code.");
      return;
    }

    try {
      const { creditedUsdAmount } = await redeemTransfer(transferCode);
      const successMessage = creditedUsdAmount 
        ? `Successfully redeemed $${creditedUsdAmount.toFixed(2)} USD!`
        : "Transfer redeemed successfully!";
      
      showToast(successMessage, 'success');
      triggerConfetti();
      setTransferCode('');
    } catch (err: any) {
      // Use the friendly error from the interceptor, or a fallback
      showToast(err.message || "Failed to redeem transfer.", 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto">
        <p className="mb-4 text-sm text-gray-600">
            Use a code from an exchange (e.g., SGTrading, Sagenex) to deposit funds into your wallet.
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
            <SGCButton type="submit" disabled={loading} variant="brand" className="w-full md:w-auto">
              {loading ? 'Redeeming...' : 'Redeem Transfer'}
            </SGCButton>
        </form>
    </div>
  );
};

export default RedeemTransferForm;