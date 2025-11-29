'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useBuyStore from '@/stores/buy.store';
import useMarketStore from '@/stores/market.store';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';
import { BankAccountRegion } from '@/services/buy.service';
import { ArrowDownUp } from 'lucide-react';

const BuySGCForm: React.FC = () => {
  const { bankAccounts, fetchBankAccounts, submitRequest, loading } = useBuyStore();
  const { livePrice } = useMarketStore();

  const [usdAmount, setUsdAmount] = useState('');
  const [sgcAmount, setSgcAmount] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<BankAccountRegion | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [referenceNote, setReferenceNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    if (livePrice && value) {
      const sgcValue = parseFloat(value) / livePrice;
      setSgcAmount(sgcValue.toFixed(6));
    } else {
      setSgcAmount('');
    }
  };

  const handleSgcChange = (value: string) => {
    setSgcAmount(value);
    if (livePrice && value) {
      const usdValue = parseFloat(value) * livePrice;
      setUsdAmount(usdValue.toFixed(2));
    } else {
      setUsdAmount('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedRegion || !usdAmount || !paymentProof) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      // The form sends USD amount and currency, as requested.
      await submitRequest({
        paymentProof,
        bankRegion: selectedRegion.region,
        fiatAmount: parseFloat(usdAmount),
        fiatCurrency: 'USD', 
        referenceNote,
      });
      setSuccess("Your request has been submitted successfully!");
      // Reset form
      setSelectedRegion(null);
      setUsdAmount('');
      setSgcAmount('');
      setPaymentProof(null);
      setReferenceNote('');
    } catch (err) {
      setError("Failed to submit your request. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Bank Details</h3>
        <p className="text-sm text-gray-500 mb-4">Transfer the required funds to the bank details below. Then, enter the **USD equivalent** of your deposit in the form.</p>
        <div className="space-y-4">
          {bankAccounts.map(acc => (
            <div key={acc.region} className="bg-gray-50 p-4 rounded-md border">
              <h4 className="font-bold text-gray-800">{acc.region} ({acc.fiatCurrency})</h4>
              <p><strong>Bank:</strong> {acc.bankName}</p>
              {acc.accountName && <p><strong>A/C Name:</strong> {acc.accountName}</p>}
              {acc.accountNumber && <p><strong>A/C Number:</strong> {acc.accountNumber}</p>}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 2: Submit Deposit Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedRegion?.region || ''}
            onChange={(e) => setSelectedRegion(bankAccounts.find(acc => acc.region === e.target.value) || null)}
            className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="" disabled>Select Bank Region of Deposit</option>
            {bankAccounts.map(acc => <option key={acc.region} value={acc.region}>{acc.region}</option>)}
          </select>
          
          <SGCInput 
            label="Amount to Spend (USD)" 
            type="number" 
            value={usdAmount} 
            onChange={e => handleUsdChange(e.target.value)} 
            required 
            placeholder="e.g., 1000"
          />
          
          <div className="flex justify-center items-center my-2">
            <ArrowDownUp size={16} className="text-gray-400" />
          </div>

          <SGCInput 
            label="SGC to Receive (est.)" 
            type="number" 
            value={sgcAmount} 
            onChange={e => handleSgcChange(e.target.value)} 
            required 
            placeholder="e.g., 8.123"
          />
          
          {livePrice && <p className="text-xs text-gray-500 text-center -mt-2">Est. Rate: 1 SGC ≈ ${livePrice.toFixed(2)} USD</p>}

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-4">Payment Proof</label>
            <input type="file" onChange={e => setPaymentProof(e.target.files ? e.target.files[0] : null)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" required />
          </div>
          <SGCInput label="Reference Note (Optional)" type="text" value={referenceNote} onChange={e => setReferenceNote(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <SGCButton type="submit" disabled={loading || !selectedRegion} variant="brand" className="w-full md:w-auto">{loading ? 'Submitting...' : 'Submit Request'}</SGCButton>
        </form>
      </div>
    </div>
  );
};

export default BuySGCForm;
