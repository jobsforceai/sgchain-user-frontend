'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/token.store';
import SGCButton from '@/components/SGCButton';
import SGCInput from '@/components/SGCInput';
import SGCCard from '@/components/SGCCard';
import { CreateTokenPayload, TokenTier } from '@/services/token.service';

interface CreateTokenFormProps {
  onCancel: () => void;
}

const CreateTokenForm: React.FC<CreateTokenFormProps> = ({ onCancel }) => {
  const { createDraft, loading, error } = useTokenStore();
  const router = useRouter();
  
  const [tier, setTier] = useState<TokenTier>('FUN');
  const [metadata, setMetadata] = useState({
    name: '',
    symbol: '',
    description: '',
  });

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setMetadata(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic payload for draft creation
    const payload: CreateTokenPayload = {
      tier,
      metadata,
      supplyConfig: {
        totalSupply: '1000000', // Default value
        isFixedSupply: true,
      },
      allocations: [
        { category: 'CREATOR', percent: 100 } // Default value
      ]
    };

    try {
      const newDraft = await createDraft(payload);
      router.push(`/token/${newDraft._id}`);
    } catch (err) {
      // Error is handled in the store, but can add component-specific logic here
      console.error(err);
    }
  };

  return (
    <SGCCard title="Create New Token">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Tier Selection */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Token Tier</label>
          <div className="flex gap-4">
            <div 
              onClick={() => setTier('FUN')}
              className={`cursor-pointer border p-4 rounded-lg w-1/2 ${tier === 'FUN' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <h3 className="font-bold">FunCoin</h3>
              <p className="text-sm text-gray-600">A standard token for community and utility purposes. (Fee: 1 SGC)</p>
            </div>
            <div 
              onClick={() => setTier('SUPER')}
              className={`cursor-pointer border p-4 rounded-lg w-1/2 ${tier === 'SUPER' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              <h3 className="font-bold">SuperCoin</h3>
              <p className="text-sm text-gray-600">An advanced token with initial liquidity support. (Fee: 100 SGC)</p>
            </div>
          </div>
        </div>

        {/* Step 2: Metadata */}
        <SGCInput label="Token Name" name="name" value={metadata.name} onChange={handleMetadataChange} required placeholder="My Awesome Token" />
        <SGCInput label="Token Symbol" name="symbol" value={metadata.symbol} onChange={handleMetadataChange} required placeholder="MAT" />
        <SGCInput label="Description" name="description" value={metadata.description} onChange={handleMetadataChange} placeholder="A brief description of your token." />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end gap-4">
          <SGCButton type="button" onClick={onCancel} disabled={loading} className="bg-gray-300 hover:bg-gray-400">
            Cancel
          </SGCButton>
          <SGCButton type="submit" disabled={loading}>
            {loading ? 'Saving Draft...' : 'Save Draft & Continue'}
          </SGCButton>
        </div>
      </form>
    </SGCCard>
  );
};

export default CreateTokenForm;
