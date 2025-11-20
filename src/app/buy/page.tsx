'use client';

import React, { useEffect, useState } from 'react';
import useBuyStore from '@/stores/buy.store';
import useWalletStore from '@/stores/wallet.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';
import { BankAccountRegion } from '@/services/buy.service';

// Placeholder for a real file upload service
const uploadFilePlaceholder = async (file: File): Promise<string> => {
  console.log(`Uploading file: ${file.name}`);
  // Simulate a 1-second upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real application, this would return a URL from a service like S3
  const fakeUrl = `https://your-s3-bucket-url.com/path/to/${file.name}`;
  console.log(`File uploaded to: ${fakeUrl}`);
  return fakeUrl;
};

const BuySGCPage: React.FC = () => {
  const {
    bankAccounts,
    requests,
    loading: buyLoading,
    error: buyError,
    fetchBankAccounts,
    submitRequest,
    fetchRequests,
  } = useBuyStore();

  const {
    wallet,
    loading: walletLoading,
    error: walletError,
    instantBuySgc,
    fetchWallet,
  } = useWalletStore();

  const [selectedRegion, setSelectedRegion] = useState<BankAccountRegion | null>(null);
  const [fiatAmount, setFiatAmount] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [referenceNote, setReferenceNote] = useState('');
  const [bankFormError, setBankFormError] = useState<string | null>(null);
  const [bankFormSuccess, setBankFormSuccess] = useState<string | null>(null);

  const [instantBuyAmount, setInstantBuyAmount] = useState('');
  const [instantBuyError, setInstantBuyError] = useState<string | null>(null);
  const [instantBuySuccess, setInstantBuySuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBankAccounts();
    fetchRequests();
    fetchWallet();
  }, [fetchBankAccounts, fetchRequests, fetchWallet]);

  const handleBankFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankFormError(null);
    setBankFormSuccess(null);

    if (!selectedRegion || !fiatAmount || !paymentProof) {
      setBankFormError("Please fill out all required fields.");
      return;
    }

    try {
      const paymentProofUrl = await uploadFilePlaceholder(paymentProof);
      await submitRequest({
        bankRegion: selectedRegion.region,
        fiatAmount: parseFloat(fiatAmount),
        fiatCurrency: selectedRegion.fiatCurrency,
        paymentProofUrl,
        referenceNote,
      });
      setBankFormSuccess("Your request has been submitted successfully!");
      // Reset form
      setSelectedRegion(null);
      setFiatAmount('');
      setPaymentProof(null);
      setReferenceNote('');
      // Refresh history
      fetchRequests();
    } catch (err) {
      setBankFormError("Failed to submit your request. Please try again.");
    }
  };

  const handleInstantBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInstantBuyError(null);
    setInstantBuySuccess(null);

    if (!instantBuyAmount || parseFloat(instantBuyAmount) <= 0) {
      setInstantBuyError("Please enter a valid SGC amount.");
      return;
    }

    try {
      await instantBuySgc(parseFloat(instantBuyAmount));
      setInstantBuySuccess("Purchase successful!");
      setInstantBuyAmount('');
    } catch (err) {
      setInstantBuyError("Purchase failed. Please check your balance and try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Buy SGC</h1>

      {buyError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{buyError}</p>}
      {walletError && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{walletError}</p>}

      {/* Instant Buy Section */}
      <div className="mb-6">
        <SGCCard title="Instant Buy with USD Balance">
          <form onSubmit={handleInstantBuySubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Your available USD Balance:</p>
              <p className="text-2xl font-bold">${wallet?.fiatBalanceUsd?.toFixed(2) || '0.00'}</p>
            </div>
            <SGCInput
              label="Amount of SGC to Buy"
              id="instantBuyAmount"
              type="number"
              value={instantBuyAmount}
              onChange={(e) => setInstantBuyAmount(e.target.value)}
              required
            />
            {instantBuyError && <p className="text-red-500 text-xs italic mt-2">{instantBuyError}</p>}
            {instantBuySuccess && <p className="text-green-500 text-xs italic mt-2">{instantBuySuccess}</p>}
            <div className="mt-4">
              <SGCButton type="submit" disabled={walletLoading}>
                {walletLoading ? 'Processing...' : 'Buy Now'}
              </SGCButton>
            </div>
          </form>
        </SGCCard>
      </div>

      <h2 className="text-2xl font-bold mb-4">Or, Buy via Bank Transfer</h2>

      {/* Step 1: Bank Details */}
      <SGCCard title="Step 1: Transfer Funds to Our Bank Account">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bankAccounts.map(acc => (
            <div key={acc.region} className="border p-4 rounded-lg">
              <h3 className="font-bold text-lg">{acc.region} ({acc.fiatCurrency})</h3>
              <p><strong>Bank:</strong> {acc.bankName}</p>
              {acc.accountName && <p><strong>Account Name:</strong> {acc.accountName}</p>}
              {acc.accountNumber && <p><strong>Account Number:</strong> {acc.accountNumber}</p>}
              {acc.ifsc && <p><strong>IFSC:</strong> {acc.ifsc}</p>}
              {acc.iban && <p><strong>IBAN:</strong> {acc.iban}</p>}
              <p className="text-sm text-gray-600 mt-2">{acc.note}</p>
            </div>
          ))}
        </div>
      </SGCCard>

      {/* Step 2: Submit Deposit Request */}
      <div className="mt-6">
        <SGCCard title="Step 2: Submit Your Deposit Details">
          <form onSubmit={handleBankFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Bank Region</label>
                <select
                  id="region"
                  value={selectedRegion?.region || ''}
                  onChange={(e) => setSelectedRegion(bankAccounts.find(acc => acc.region === e.target.value) || null)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="" disabled>Select a region</option>
                  {bankAccounts.map(acc => <option key={acc.region} value={acc.region}>{acc.region} ({acc.fiatCurrency})</option>)}
                </select>
              </div>
              <SGCInput
                label="Fiat Amount Deposited"
                id="fiatAmount"
                type="number"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(e.target.value)}
                required
              />
              <div>
                <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700">Payment Proof (Screenshot)</label>
                <input
                  id="paymentProof"
                  type="file"
                  onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  required
                />
              </div>
              <SGCInput
                label="Reference Note (Optional)"
                id="referenceNote"
                type="text"
                value={referenceNote}
                onChange={(e) => setReferenceNote(e.target.value)}
              />
            </div>
            {bankFormError && <p className="text-red-500 text-xs italic mt-4">{bankFormError}</p>}
            {bankFormSuccess && <p className="text-green-500 text-xs italic mt-4">{bankFormSuccess}</p>}
            <div className="mt-6">
              <SGCButton type="submit" disabled={buyLoading}>
                {buyLoading ? 'Submitting...' : 'Submit Request'}
              </SGCButton>
            </div>
          </form>
        </SGCCard>
      </div>

      {/* Step 3: Request History */}
      <div className="mt-6">
        <SGCCard title="Step 3: Your Buy Request History">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Region</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">SGC Locked</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req._id}>
                    <td className="py-2 px-4 border-b">{new Date(req.lockedAt).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{req.bankRegion}</td>
                    <td className="py-2 px-4 border-b">{req.fiatAmount} {req.fiatCurrency}</td>
                    <td className="py-2 px-4 border-b">{req.lockedSgcAmount.toFixed(6)}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SGCCard>
      </div>
    </div>
  );
};

export default BuySGCPage;
