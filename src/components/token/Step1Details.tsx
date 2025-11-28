'use client';

import React from 'react';
import { CreateTokenPayload, TokenTier } from '@/services/token.service';
import SGCInput from '../SGCInput';

interface Step1DetailsProps {
  formData: CreateTokenPayload;
  setFormData?: React.Dispatch<React.SetStateAction<CreateTokenPayload>>;
  isViewOnly?: boolean;
}

const Step1Details: React.FC<Step1DetailsProps> = ({ formData, setFormData, isViewOnly = false }) => {
  const handleTierChange = (tier: TokenTier) => {
    if (isViewOnly || !setFormData) return;
    setFormData(prev => {
      const newAllocations = [...prev.allocations];
      const hasLiquidity = newAllocations.some(a => a.category === 'LIQUIDITY');

      if (tier === 'SUPER' && !hasLiquidity) {
        newAllocations.push({ category: 'LIQUIDITY', percent: 0 });
      } else if (tier === 'FUN' && hasLiquidity) {
        return { ...prev, tier, allocations: newAllocations.filter(a => a.category !== 'LIQUIDITY') };
      }
      
      return { ...prev, tier, allocations: newAllocations };
    });
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isViewOnly || !setFormData) return;
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [e.target.name]: e.target.value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Token Tier</label>
        <div className="flex flex-col md:flex-row gap-4">
          <div
            onClick={!isViewOnly ? () => handleTierChange('FUN') : undefined}
            className={`border p-4 rounded-lg w-full md:w-1/2 ${formData.tier === 'FUN' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isViewOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <h3 className="font-bold">FunCoin</h3>
            <p className="text-sm text-gray-600">Fee: 1 SGC</p>
          </div>
          <div
            onClick={!isViewOnly ? () => handleTierChange('SUPER') : undefined}
            className={`border p-4 rounded-lg w-full md:w-1/2 ${formData.tier === 'SUPER' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isViewOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <h3 className="font-bold">SuperCoin</h3>
            <p className="text-sm text-gray-600">Fee: 100 SGC</p>
          </div>
        </div>
      </div>

      <SGCInput label="Token Name" name="name" value={formData.metadata.name} onChange={handleMetadataChange} required disabled={isViewOnly} />
      <SGCInput label="Token Symbol" name="symbol" value={formData.metadata.symbol} onChange={handleMetadataChange} required disabled={isViewOnly} />
      <SGCInput label="Description" name="description" value={formData.metadata.description || ''} onChange={handleMetadataChange} disabled={isViewOnly} />
      <SGCInput label="Website" name="website" value={formData.metadata.website || ''} onChange={handleMetadataChange} disabled={isViewOnly} />
      <SGCInput label="Twitter" name="twitter" value={formData.metadata.twitter || ''} onChange={handleMetadataChange} disabled={isViewOnly} />
    </div>
  );
};

export default Step1Details;
