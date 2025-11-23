'use client';

import React, { useState, useEffect } from 'react';
import useTransferStore from '@/stores/transfer.store';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';

const ExternalTransferForm: React.FC = () => {
  const { submitExternalTransfer, transferResult, loading, error, clearResult } = useTransferStore();
  const [amountSgc, setAmountSgc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Clear previous results when component mounts or unmounts
  useEffect(() => {
    return () => {
      clearResult();
    };
  }, [clearResult]);

  const handleCopyToClipboard = () => {
    if (transferResult?.code) {
      navigator.clipboard.writeText(transferResult.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amount = parseFloat(amountSgc);
    if (isNaN(amount) || amount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    try {
      await submitExternalTransfer({ amountSgc: amount });
      setAmountSgc(''); // Clear input on success
    } catch (err) {
      // The store sets a global error message which we can display.
      // No need to set formError here as the `error` from the store will be used.
    }
  };
  
  if (transferResult) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-lg font-semibold text-green-600">Transfer Code Generated!</h3>
        <p className="mt-2 text-sm text-gray-600">
          Use the code below to redeem your funds on the SGTrading platform.
        </p>
        <div className="my-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">Your Redeem Code</p>
          <p className="text-2xl font-bold font-mono tracking-widest">{transferResult.code}</p>
        </div>
        <SGCButton onClick={handleCopyToClipboard} className="w-full mb-2">
          {copied ? 'Copied!' : 'Copy Code'}
        </SGCButton>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 text-left">
            <p className="font-bold">Security Warning</p>
            <p className="text-sm">For your security, this code is shown only once. Please copy it and store it securely before leaving this page.</p>
        </div>
        <button onClick={clearResult} className="mt-4 text-sm text-blue-600 hover:underline">
          Make another transfer
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <p className="mb-4 text-sm text-gray-600">
        Transfer SGC to your SGTrading account. A redeemable code will be generated that you can use on the SGTrading platform to deposit funds.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SGCInput
          label="Amount in SGC"
          type="number"
          value={amountSgc}
          onChange={(e) => setAmountSgc(e.target.value)}
          required
          min="0"
          step="any"
        />
        {(formError || error) && <p className="text-red-500 text-sm">{formError || error}</p>}
        <SGCButton type="submit" disabled={loading} className="w-full">
          {loading ? 'Generating Code...' : 'Generate Transfer Code'}
        </SGCButton>
      </form>
    </div>
  );
};

export default ExternalTransferForm;
