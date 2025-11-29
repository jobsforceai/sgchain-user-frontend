'use client';

import React from 'react';
import useTokenStore from '@/stores/token.store';
import useWalletStore from '@/stores/wallet.store';
import { CreateTokenPayload } from '@/services/token.service';
import SGCButton from '../SGCButton';

interface Step4ReviewProps {
  formData: CreateTokenPayload;
  id: string;
  isViewOnly?: boolean;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ formData, id, isViewOnly = false }) => {
  const { deployToken, loading: isDeploying, error: deployError } = useTokenStore();
  const { wallet } = useWalletStore();

  const deploymentCost = formData.tier === 'SUPER' ? 100 : 1;
  const hasEnoughFunds = wallet ? wallet.sgcBalance >= deploymentCost : false;

  const handleDeploy = () => {
    deployToken(id);
  };

  console.log('Wallet object in Step4Review:', wallet);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Token</h3>
      
      <div className="p-4 border rounded-md bg-gray-50 space-y-2">
        <p><strong>Name:</strong> {formData.metadata.name}</p>
        <p><strong>Symbol:</strong> {formData.metadata.symbol}</p>
        <p><strong>Total Supply:</strong> {Number(formData.supplyConfig.totalSupply).toLocaleString()}</p>
        <p><strong>Tier:</strong> {formData.tier}</p>
      </div>

      <div className="p-4 border rounded-md">
        <h4 className="font-semibold mb-2">Allocations</h4>
        <ul className="list-disc list-inside">
          {formData.allocations.map((alloc, i) => (
            <li key={i}>{alloc.category}: {alloc.percent}%</li>
          ))}
        </ul>
      </div>

      <div className="p-4 border rounded-md">
        <h4 className="font-semibold mb-2">Deployment Cost</h4>
        <p className="text-xl font-bold">{deploymentCost} SGC</p>
        {formData.tier === 'SUPER' && (
          <p className="text-xs text-gray-600 mt-1">
            (10 SGC Platform Fee + 90 SGC for initial Liquidity Pool)
          </p>
        )}
        <p className="text-sm text-gray-600">Your SGC Balance: {wallet?.sgcBalance.toFixed(4) || 'N/A'}</p>
        {!hasEnoughFunds && <p className="text-red-500 text-sm mt-2">You have insufficient SGC balance to deploy this token.</p>}
      </div>

      {deployError && <p className="text-red-500">{deployError}</p>}

      {!isViewOnly && (
        <SGCButton onClick={handleDeploy} disabled={isDeploying || !hasEnoughFunds} className="w-full">
          {isDeploying ? 'Deploying...' : 'Deploy Token'}
        </SGCButton>
      )}
    </div>
  );
};

export default Step4Review;
