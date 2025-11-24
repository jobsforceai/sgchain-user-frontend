import React from 'react';
import SGCCard from './SGCCard';

interface SGCBalanceCardProps {
  balance: number;
  valueUsd: number;
  fiatBalanceUsd?: number;
}

const SGCBalanceCard: React.FC<SGCBalanceCardProps> = ({ balance, valueUsd, fiatBalanceUsd }) => {
  return (
    <SGCCard
      title="Account Balance"
      className="sgc-glass rounded-xl shadow-lg p-6 text-gray-900"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Balance</div>
            <div style={{ color: 'var(--sg-primary)' }} className="px-2 py-0.5 rounded-md text-xs font-cream">SGC</div>
          </div>

          <div className="mt-2">
            <p className="text-4xl md:text-5xl font-extrabold leading-tight">{balance.toFixed(4)}</p>
            <p className="text-sm text-gray-500">≈ <span className="font-semibold text-gray-700">${valueUsd.toFixed(2)}</span></p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">USD Balance</p>
          <p className="text-3xl font-bold mt-2">${(fiatBalanceUsd || 0).toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Available for instant buy</p>
        </div>
      </div>
    </SGCCard>
  );
};

export default SGCBalanceCard;
