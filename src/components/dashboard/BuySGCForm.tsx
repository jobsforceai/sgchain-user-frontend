'use client';

import React, { useState, useEffect } from 'react';
import useBuyStore from '@/stores/buy.store';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';
import { BankAccountRegion } from '@/services/buy.service';

const uploadFilePlaceholder = async (file: File): Promise<string> => {
  console.log(`Uploading file: ${file.name}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://fake-upload-url.com/${file.name}`;
};

const BuySGCForm: React.FC = () => {
  const { bankAccounts, fetchBankAccounts, submitRequest, loading } = useBuyStore();
  const [selectedRegion, setSelectedRegion] = useState<BankAccountRegion | null>(null);
  const [fiatAmount, setFiatAmount] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [referenceNote, setReferenceNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedRegion || !fiatAmount || !paymentProof) {
      setError("Please fill out all required fields.");
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
      setSuccess("Your request has been submitted successfully!");
      // Reset form
      setSelectedRegion(null);
      setFiatAmount('');
      setPaymentProof(null);
      setReferenceNote('');
    } catch (err) {
      setError("Failed to submit your request. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Step 1: Bank Details</h3>
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
            <option value="" disabled>Select Bank Region</option>
            {bankAccounts.map(acc => <option key={acc.region} value={acc.region}>{acc.region}</option>)}
          </select>
          <SGCInput label="Amount Deposited" type="number" value={fiatAmount} onChange={e => setFiatAmount(e.target.value)} required />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Payment Proof</label>
            <input type="file" onChange={e => setPaymentProof(e.target.files ? e.target.files[0] : null)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" required />
          </div>
          <SGCInput label="Reference Note (Optional)" type="text" value={referenceNote} onChange={e => setReferenceNote(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <SGCButton type="submit" disabled={loading} variant="brand" className="w-full md:w-auto">{loading ? 'Submitting...' : 'Submit Request'}</SGCButton>
        </form>
      </div>
    </div>
  );
};

export default BuySGCForm;
