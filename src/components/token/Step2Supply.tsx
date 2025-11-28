'use client';

import React from 'react';
import { CreateTokenPayload, AllocationCategory } from '@/services/token.service';
import SGCInput from '../SGCInput';
import SGCButton from '../SGCButton';

interface Step2SupplyProps {
  formData: CreateTokenPayload;
  setFormData?: React.Dispatch<React.SetStateAction<CreateTokenPayload>>;
  isViewOnly?: boolean;
}

const ALLOCATION_CATEGORIES: AllocationCategory[] = [
  'CREATOR', 'TEAM', 'TREASURY', 'COMMUNITY', 'LIQUIDITY', 'ADVISORS', 'MARKETING', 'AIRDROP', 'RESERVE', 'OTHER'
];

const Step2Supply: React.FC<Step2SupplyProps> = ({ formData, setFormData, isViewOnly = false }) => {

  const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setFormData) return;
    setFormData(prev => ({
      ...prev,
      supplyConfig: { ...prev.supplyConfig, totalSupply: e.target.value },
    }));
  };

  const handleAllocationChange = (index: number, field: string, value: string | number) => {
    if (!setFormData) return;
    const newAllocations = [...formData.allocations];
    (newAllocations[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, allocations: newAllocations }));
  };

  const addAllocation = () => {
    if (!setFormData) return;
    setFormData(prev => ({
      ...prev,
      allocations: [...prev.allocations, { category: 'OTHER', percent: 0 }],
    }));
  };

  const removeAllocation = (index: number) => {
    if (!setFormData) return;
    const newAllocations = formData.allocations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, allocations: newAllocations }));
  };

  const totalAllocation = formData.allocations.reduce((sum, alloc) => sum + (Number(alloc.percent) || 0), 0);

  return (
    <div className="space-y-6">
      <SGCInput 
        label="Total Supply" 
        type="number" 
        value={formData.supplyConfig.totalSupply} 
        onChange={handleSupplyChange} 
        required 
        disabled={isViewOnly}
        min={1000}
        max={formData.tier === 'FUN' ? 1000000 : 1000000000000}
      />
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Token Allocations</h3>
        {formData.allocations.map((alloc, index) => {
          const isLiquidityOnSuper = formData.tier === 'SUPER' && alloc.category === 'LIQUIDITY';
          return (
            <div key={index} className="flex flex-col md:flex-row items-center gap-4 mb-2 p-2 border rounded-md">
              <div className="w-full">
                <SGCInput
                  label="Category"
                  type="select"
                  value={alloc.category}
                  onChange={(e) => handleAllocationChange(index, 'category', e.target.value)}
                  disabled={isViewOnly || isLiquidityOnSuper}
                  options={ALLOCATION_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                />
              </div>
              <div className="w-full md:w-24">
                <SGCInput 
                  label="Percentage"
                  type="number"
                  value={alloc.percent}
                  onChange={(e) => handleAllocationChange(index, 'percent', parseFloat(e.target.value) || 0)}
                  disabled={isViewOnly}
                  min={isLiquidityOnSuper ? 5 : 0}
                />
              </div>
              <div className="flex-grow w-full">
                <SGCInput 
                  label="Target Wallet (Optional)"
                  type="text"
                  value={alloc.targetWalletAddress || ''}
                  onChange={(e) => handleAllocationChange(index, 'targetWalletAddress', e.target.value)}
                  disabled={isViewOnly}
                />
              </div>
              {!isViewOnly && !isLiquidityOnSuper && <SGCButton onClick={() => removeAllocation(index)} variant="danger" className="py-1 px-2 text-xs w-full md:w-auto">Remove</SGCButton>}
            </div>
          );
        })}
        {!isViewOnly && <SGCButton onClick={addAllocation} className="mt-2 text-sm py-1 px-2">Add Allocation</SGCButton>}
      </div>

      <div className="mt-4 text-right">
        <p className={`font-bold ${totalAllocation !== 100 ? 'text-red-500' : 'text-green-600'}`}>
          Total: {totalAllocation.toFixed(2)}%
        </p>
        {totalAllocation !== 100 && <p className="text-red-500 text-xs">Total allocation must be exactly 100%.</p>}
      </div>
    </div>
  );
};

export default Step2Supply;
