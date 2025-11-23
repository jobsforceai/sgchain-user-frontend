'use client';

import React from 'react';
import SGCCard from '@/components/SGCCard';
import SwapForm from '@/components/swap/SwapForm';

const SwapPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Token Swap</h1>
      <SGCCard>
        <SwapForm />
      </SGCCard>
    </div>
  );
};

export default SwapPage;
