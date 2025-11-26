'use client';

import React, { useState, useEffect } from 'react';
import useSwapStore from '@/stores/swap.store';
import useWalletStore from '@/stores/wallet.store';
import useTokenStore from '@/stores/token.store';
import SGCInput from '../SGCInput';
import SGCButton from '../SGCButton';
import { TokenLaunch } from '@/services/token.service';
import { Repeat, ChevronDown } from 'lucide-react';

// New, reusable component for the token input fields
const TokenInput = ({
  label,
  token,
  setToken,
  amount,
  setAmount,
  tokens,
  balance
}: {
  label: string;
  token: string;
  setToken: (token: string) => void;
  amount: string;
  setAmount: (amount: string) => void;
  tokens: any[];
  balance: number;
}) => (
  <div className="bg-gray-800/50 p-4 rounded-xl border border-white/10">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm text-gray-400">Balance: {balance.toFixed(4)}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          className="w-full bg-transparent text-2xl font-semibold text-white focus:outline-none"
        />
      </div>
      <div className="relative">
        <select
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="appearance-none bg-gray-700/50 text-white font-semibold py-2 pl-4 pr-8 rounded-full focus:outline-none"
        >
          {tokens.map((t) => (
            <option key={t.symbol} value={t.symbol}>
              {t.symbol}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </div>
  </div>
);

const SwapForm: React.FC = () => {
  const { quote, loading, error, fetchQuote, performSwap, swapResult, clearResult } = useSwapStore();
  const { wallet, verifyPin, pinVerifiedForDetails, clearWalletDetails } = useWalletStore();
  const { tokens, fetchTokens } = useTokenStore();

  const [tokenIn, setTokenIn] = useState('SGC');
  const [tokenOut, setTokenOut] = useState('');
  const [amountIn, setAmountIn] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);
  
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut) {
      const timeoutId = setTimeout(() => {
        fetchQuote({ tokenIn, tokenOut, amountIn });
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [amountIn, tokenIn, tokenOut, fetchQuote]);

  useEffect(() => {
    if (pinVerifiedForDetails) {
      setShowPinModal(false);
      handlePerformSwap();
    }
  }, [pinVerifiedForDetails]);

  const handleSwapClick = () => {
    clearResult();
    setShowPinModal(true);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    try {
      await verifyPin(pinInput);
    } catch (err: any) {
      setModalError(err.message || "Invalid PIN");
    } finally {
      setPinInput('');
    }
  };

  const handlePerformSwap = async () => {
    try {
      await performSwap({ tokenIn, tokenOut, amountIn });
    } finally {
      clearWalletDetails();
    }
  };

  const handleSwitchTokens = () => {
    const tempToken = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(tempToken);
  };

  const availableTokens = [
    { symbol: 'SGC', name: 'SGCoin' },
    ...tokens.filter(t => t.status === 'DEPLOYED').map(t => t.metadata),
  ];

  const PinModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md">
        <form onSubmit={handlePinSubmit} className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-3">Confirm Swap</h3>
          <SGCInput label="Enter PIN to Confirm Swap" type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} maxLength={4} required />
          {modalError && <p className="text-red-500 text-xs mt-2">{modalError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <SGCButton type="button" onClick={() => setShowPinModal(false)} variant="outline">Cancel</SGCButton>
            <SGCButton type="submit" variant="brand">Confirm</SGCButton>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="w-full text-white">
      {showPinModal && <PinModal />}
      <div className="relative">
        <div className="space-y-2">
          <TokenInput
            label="From"
            token={tokenIn}
            setToken={setTokenIn}
            amount={amountIn}
            setAmount={setAmountIn}
            tokens={availableTokens}
            balance={wallet?.sgcBalance || 0} // Placeholder, needs real balance
          />
          <TokenInput
            label="To"
            token={tokenOut}
            setToken={setTokenOut}
            amount={quote?.amountOut || ''}
            setAmount={() => {}} // "To" amount is not editable
            tokens={availableTokens}
            balance={0} // Placeholder, needs real balance
          />
        </div>
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <button onClick={handleSwitchTokens} className="bg-gray-700 p-2 rounded-full border-4 border-gray-900 text-white hover:rotate-180 transition-transform">
            <Repeat size={20} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <SGCButton onClick={handleSwapClick} disabled={loading || !amountIn || !tokenIn || !tokenOut} variant="brand" className="w-full py-3 text-lg">
          {loading ? 'Processing...' : 'Swap'}
        </SGCButton>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {swapResult && (
        <div className="mt-4 p-4 bg-green-900/50 border border-green-500/30 text-green-300 rounded-md">
          <p className="font-semibold">Swap Successful!</p>
          <p className="text-sm">Transaction Hash: <span className="font-mono text-sm">{swapResult.txHash}</span></p>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
