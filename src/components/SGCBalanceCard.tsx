import React from 'react';
import SGCCard from './SGCCard';

interface SGCBalanceCardProps {
  balance: number;
  valueUsd: number;
  fiatBalanceUsd?: number;
}

const SGCBalanceCard: React.FC<SGCBalanceCardProps> = ({ balance, valueUsd, fiatBalanceUsd }) => {
  return (
    <SGCCard title="Account Balance">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">SGC Balance</p>
          <p className="text-2xl font-bold">{balance.toFixed(4)} SGC</p>
          <p className="text-gray-500">~ ${valueUsd.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">USD Balance</p>
          <p className="text-2xl font-bold">${(fiatBalanceUsd || 0).toFixed(2)}</p>
          <p className="text-gray-500">Available for instant buy</p>
        </div>
      </div>
    </SGCCard>
  );
};

export default SGCBalanceCard;
