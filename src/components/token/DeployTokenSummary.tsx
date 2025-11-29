'use client';

import React from 'react';
import { Token } from '@/services/token.service';
import SGCButton from '../SGCButton';
import SGCCard from '../SGCCard';
import { Check, ShieldCheck, Coins, PiggyBank, Briefcase } from 'lucide-react';

interface DeployTokenSummaryProps {
  token: Token;
  onDeploy: () => void;
  onEdit: () => void;
  isDeploying: boolean;
}

const DeployTokenSummary: React.FC<DeployTokenSummaryProps> = ({ token, onDeploy, onEdit, isDeploying }) => {
  const cost = token.tier === 'FUN' ? '1 SGC' : '100 SGC (10 Fee + 90 Liquidity)';

  return (
    <SGCCard>
      <div className="p-6">
        <div className="text-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Review & Deploy Token</h2>
          <p className="text-gray-500">This is the final step. Deploying will create the token on the blockchain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Briefcase size={20} /> Details</h3>
            <div className="text-sm bg-gray-50 p-3 rounded-md">
              <p><strong>Name:</strong> {token.metadata.name}</p>
              <p><strong>Symbol:</strong> {token.metadata.symbol}</p>
              <p><strong>Decimals:</strong> {token.metadata.decimals}</p>
              {token.metadata.description && <p><strong>Description:</strong> {token.metadata.description}</p>}
            </div>
            
            <h3 className="font-semibold text-lg flex items-center gap-2"><Coins size={20} /> Supply</h3>
            <div className="text-sm bg-gray-50 p-3 rounded-md">
              <p><strong>Total Supply:</strong> {Number(token.supplyConfig.totalSupply).toLocaleString()}</p>
              <p><strong>Supply Type:</strong> {token.supplyConfig.isFixedSupply ? 'Fixed' : 'Variable'}</p>
            </div>
          </div>

          {/* Right Column: Allocations & Cost */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><PiggyBank size={20} /> Allocations</h3>
            <ul className="text-sm bg-gray-50 p-3 rounded-md space-y-1">
              {token.allocations.map(alloc => (
                <li key={alloc.category} className="flex justify-between">
                  <span>{alloc.category}:</span>
                  <span className="font-medium">{alloc.percent}%</span>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold text-lg flex items-center gap-2"><ShieldCheck size={20} /> Final Cost</h3>
            <div className="text-sm bg-yellow-50 border border-yellow-200 p-3 rounded-md">
              <p className="font-bold text-yellow-800">Creation Cost: {cost}</p>
              <p className="text-xs text-yellow-700 mt-1">This amount will be deducted from your SGC balance upon deployment.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end items-center gap-4">
          <SGCButton onClick={onEdit} variant="outline" disabled={isDeploying}>
            Edit Draft
          </SGCButton>
          <SGCButton onClick={onDeploy} disabled={isDeploying} className="w-full sm:w-auto">
            {isDeploying ? 'Deploying...' : `Deploy Token & Pay ${cost}`}
          </SGCButton>
        </div>
      </div>
    </SGCCard>
  );
};

export default DeployTokenSummary;
