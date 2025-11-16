import React from 'react';
import SGCCard from './SGCCard';

interface SGCBalanceCardProps {
  balance: number;
  valueUsd: number;
}

const SGCBalanceCard: React.FC<SGCBalanceCardProps> = ({ balance, valueUsd }) => {
  return (
    <SGCCard title="SGC Balance">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">Balance</p>
          <p className="text-2xl font-bold">{balance.toFixed(4)} SGC</p>
        </div>
        <div>
          <p className="text-gray-500">Value (USD)</p>
          <p className="text-2xl font-bold">${valueUsd.toFixed(2)}</p>
        </div>
      </div>
    </SGCCard>
  );
};

export default SGCBalanceCard;
