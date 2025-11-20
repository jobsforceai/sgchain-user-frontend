'use client';

import React, { useState, useEffect, useMemo } from 'react';
import useWithdrawalStore from '@/stores/withdrawal.store';
import useKycStore from '@/stores/kyc.store';
import SGCCard from '@/components/SGCCard';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';
import { WithdrawalType, BankRegion, CryptoNetwork, WithdrawalDetails } from '@/services/withdrawal.service';
import useWalletStore from '@/stores/wallet.store';

const BankFormIndia = ({ onDetailsChange }: { onDetailsChange: (details: any) => void }) => {
  return (
    <div className="space-y-4">
      <SGCInput name="accountHolderName" label="Account Holder Name" onChange={onDetailsChange} required />
      <SGCInput name="accountNumber" label="Account Number" onChange={onDetailsChange} required />
      <SGCInput name="ifscCode" label="IFSC Code" onChange={onDetailsChange} required />
      <SGCInput name="bankName" label="Bank Name" onChange={onDetailsChange} required />
    </div>
  );
};

const BankFormDubai = ({ onDetailsChange }: { onDetailsChange: (details: any) => void }) => {
  return (
    <div className="space-y-4">
      <SGCInput name="beneficiaryName" label="Beneficiary Name" onChange={onDetailsChange} required />
      <SGCInput name="iban" label="IBAN" onChange={onDetailsChange} required />
      <SGCInput name="swiftBic" label="SWIFT/BIC" onChange={onDetailsChange} required />
      <SGCInput name="bankName" label="Bank Name" onChange={onDetailsChange} required />
    </div>
  );
};

const CryptoForm = ({ onDetailsChange }: { onDetailsChange: (details: any) => void }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Network</label>
      <select name="network" onChange={onDetailsChange} className="mt-1 block w-full p-2 border rounded-md">
        <option value="TRC20">TRC20</option>
        <option value="ERC20">ERC20</option>
        <option value="BTC">BTC</option>
      </select>
      <SGCInput name="address" label="Crypto Address" onChange={onDetailsChange} required />
    </div>
  );
};

const WithdrawPage: React.FC = () => {
  const { loading, error, requestWithdrawal } = useWithdrawalStore();
  const { kycStatuses, fetchKycStatus } = useKycStore();
  const { wallet, fetchWallet } = useWalletStore();
  const fiatBalanceUsd = wallet?.fiatBalanceUsd ?? 0;

  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType>('BANK');
  const [bankRegion, setBankRegion] = useState<BankRegion>('INDIA');
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

  const verifiedRegions = useMemo(() => 
    kycStatuses.filter(s => s.status === 'VERIFIED').map(s => s.region)
  , [kycStatuses]);

  const canWithdrawCrypto = verifiedRegions.length > 0;
  const canWithdrawBank = (region: BankRegion) => verifiedRegions.includes(region);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Request Withdrawal</h1>
      <SGCCard>
        <div className="mb-4">
          <p className="text-lg font-semibold">Your USD Balance: ${fiatBalanceUsd.toFixed(2)}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Withdrawal Type</label>
            <select value={withdrawalType} onChange={e => setWithdrawalType(e.target.value as WithdrawalType)} className="mt-1 block w-full p-2 border rounded-md">
              <option value="BANK">Bank Transfer</option>
              <option value="CRYPTO">Cryptocurrency</option>
            </select>
          </div>

          <SGCInput label="Amount (USD)" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />

          {withdrawalType === 'BANK' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Region</label>
              <select value={bankRegion} onChange={e => setBankRegion(e.target.value as BankRegion)} className="mt-1 block w-full p-2 border rounded-md">
                <option value="INDIA">India</option>
                <option value="DUBAI">Dubai</option>
              </select>
              
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                {bankRegion === 'INDIA' && <BankFormIndia onDetailsChange={handleDetailsChange} />}
                {bankRegion === 'DUBAI' && <BankFormDubai onDetailsChange={handleDetailsChange} />}
              </div>
              {!canWithdrawBank(bankRegion) && <p className="text-red-500 text-xs mt-2">Your KYC is not verified for {bankRegion}. Please complete KYC to enable withdrawals for this region.</p>}
            </div>
          )}

          {withdrawalType === 'CRYPTO' && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <CryptoForm onDetailsChange={handleDetailsChange} />
              {!canWithdrawCrypto && <p className="text-red-500 text-xs mt-2">You must have a verified KYC in at least one region to withdraw crypto.</p>}
            </div>
          )}

          {message && <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
          {error && !message && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <SGCButton type="submit" disabled={loading || (withdrawalType === 'BANK' && !canWithdrawBank(bankRegion)) || (withdrawalType === 'CRYPTO' && !canWithdrawCrypto)}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </SGCButton>
        </form>
      </SGCCard>
    </div>
  );
};

export default WithdrawPage;