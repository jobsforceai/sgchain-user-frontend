'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useWithdrawalStore from '@/stores/withdrawal.store';
import useKycStore from '@/stores/kyc.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';
import { WithdrawalType, BankRegion, CryptoNetwork, WithdrawalDetails } from '@/services/withdrawal.service';
import useWalletStore from '@/stores/wallet.store';
import { Landmark, Globe, CircleDollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

const BankFormIndia = ({ onDetailsChange }: { onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="space-y-4">
    <SGCInput name="accountHolderName" label="Account Holder Name" onChange={onDetailsChange} required />
    <SGCInput name="accountNumber" label="Account Number" onChange={onDetailsChange} required />
    <SGCInput name="ifscCode" label="IFSC Code" onChange={onDetailsChange} required />
    <SGCInput name="bankName" label="Bank Name" onChange={onDetailsChange} required />
  </div>
);

const BankFormDubai = ({ onDetailsChange }: { onDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div className="space-y-4">
    <SGCInput name="beneficiaryName" label="Beneficiary Name" onChange={onDetailsChange} required />
    <SGCInput name="iban" label="IBAN" onChange={onDetailsChange} required />
    <SGCInput name="swiftBic" label="SWIFT/BIC" onChange={onDetailsChange} required />
    <SGCInput name="bankName" label="Bank Name" onChange={onDetailsChange} required />
  </div>
);

const CryptoForm = ({ onDetailsChange }: { onDetailsChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
  <div className="space-y-4">
    <label className="block text-sm font-medium text-gray-700">Network</label>
    <select name="network" onChange={onDetailsChange} className="mt-1 block w-full p-2 border rounded-md bg-gray-50">
      <option value="TRC20">TRC20</option>
      <option value="ERC20">ERC20</option>
      <option value="BTC">BTC</option>
    </select>
    <SGCInput name="address" label="Crypto Address" onChange={onDetailsChange} required />
  </div>
);

const WithdrawPage: React.FC = () => {
  const { loading, error, requestWithdrawal } = useWithdrawalStore();
  const { kycStatuses, fetchKycStatus } = useKycStore();
  const { wallet, fetchWallet } = useWalletStore();
  const fiatBalanceUsd = wallet?.fiatBalanceUsd ?? 0;

  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType | null>(null);
  const [bankRegion, setBankRegion] = useState<BankRegion | null>(null);
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState<Partial<WithdrawalDetails>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchKycStatus();
    fetchWallet();
  }, [fetchKycStatus, fetchWallet]);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const verifiedRegions = useMemo(() => kycStatuses.filter(s => s.status === 'VERIFIED').map(s => s.region), [kycStatuses]);

  const canWithdrawCrypto = verifiedRegions.length > 0;
  const canWithdrawBank = (region: BankRegion) => verifiedRegions.includes(region);
  
  const isSubmissionDisabled = useMemo(() => {
    if (loading) return true;
    if (withdrawalType === 'BANK') return !bankRegion || !canWithdrawBank(bankRegion);
    if (withdrawalType === 'CRYPTO') return !canWithdrawCrypto;
    return true;
  }, [loading, withdrawalType, bankRegion, canWithdrawBank, canWithdrawCrypto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawalType) return;

    setMessage(null);
    const amountUsd = parseFloat(amount);
    if (isNaN(amountUsd) || amountUsd <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount.' });
      return;
    }

    const payloadDetails = withdrawalType === 'BANK'
      ? { ...details, region: bankRegion }
      : { ...details, network: (details as any).network || 'TRC20' };

    try {
      await requestWithdrawal({
        amountUsd,
        withdrawalType,
        withdrawalDetails: payloadDetails as WithdrawalDetails,
      });
      setMessage({ type: 'success', text: 'Withdrawal request submitted successfully!' });
      setAmount('');
      setDetails({});
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred.' });
    }
  };

  const renderFormContent = () => {
    if (!withdrawalType) {
      return (
        <div className="text-center text-gray-500 pt-8">
          <p>Please select a withdrawal method to continue.</p>
        </div>
      );
    }
    
    if (withdrawalType === 'BANK') {
      return (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Bank Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(['INDIA', 'DUBAI'] as BankRegion[]).map(region => (
              <button key={region} onClick={() => setBankRegion(region)} className={`p-4 border rounded-lg text-left transition-all ${bankRegion === region ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{region}</span>
                  {!canWithdrawBank(region) && <AlertCircle size={18} className="text-red-500" />}
                </div>
              </button>
            ))}
          </div>
          {bankRegion && (
            <SGCCard>
              {bankRegion === 'INDIA' && <BankFormIndia onDetailsChange={handleDetailsChange} />}
              {bankRegion === 'DUBAI' && <BankFormDubai onDetailsChange={handleDetailsChange} />}
            </SGCCard>
          )}
        </>
      );
    }

    if (withdrawalType === 'CRYPTO') {
      return <SGCCard><CryptoForm onDetailsChange={handleDetailsChange} /></SGCCard>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Request Withdrawal</h1>
      
      <SGCCard className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Your available balance</p>
          <p className="text-3xl font-bold text-gray-800">${fiatBalanceUsd.toFixed(2)}</p>
        </div>
      </SGCCard>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <SGCCard>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Withdrawal Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="button" onClick={() => { setWithdrawalType('BANK'); setBankRegion(null); }} className={`p-6 border rounded-lg text-center transition-all ${withdrawalType === 'BANK' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
              <Landmark size={32} className="mx-auto mb-2" />
              <span className="font-semibold">Bank Transfer</span>
            </button>
            <button type="button" onClick={() => setWithdrawalType('CRYPTO')} className={`p-6 border rounded-lg text-center transition-all ${withdrawalType === 'CRYPTO' ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}>
              <Globe size={32} className="mx-auto mb-2" />
              <span className="font-semibold">Cryptocurrency</span>
            </button>
          </div>
        </SGCCard>
        
        <SGCCard>
          <div className="relative flex items-center">
            <SGCInput label="Amount to Withdraw (USD)" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
            <CircleDollarSign size={18} className="absolute right-3 top-10 text-gray-400" />
          </div>
        </SGCCard>

        {renderFormContent()}

        {message && (
          <div className={`flex items-center gap-3 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
            <span>{message.text}</span>
          </div>
        )}
        {error && !message && <p className="text-sm text-red-600">{error}</p>}

        <SGCButton type="submit" disabled={isSubmissionDisabled} className="w-full">
          {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
        </SGCButton>
      </form>
    </div>
  );
};

export default WithdrawPage;