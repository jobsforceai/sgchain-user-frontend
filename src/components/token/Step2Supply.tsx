'use client';

import React, { useEffect, useMemo } from 'react';
import { CreateTokenPayload, AllocationCategory } from '@/services/token.service';
import SGCInput from '../SGCInput';
import SGCButton from '../SGCButton';
import { AlertCircle } from 'lucide-react';

interface Step2SupplyProps {
  formData: CreateTokenPayload;
  setFormData?: React.Dispatch<React.SetStateAction<CreateTokenPayload>>;
  isViewOnly?: boolean;
  setIsValid?: (isValid: boolean) => void;
}

const ALLOCATION_CATEGORIES: AllocationCategory[] = [
  'CREATOR', 'TEAM', 'TREASURY', 'COMMUNITY', 'LIQUIDITY', 'ADVISORS', 'MARKETING', 'AIRDROP', 'RESERVE', 'OTHER'
];

const Step2Supply: React.FC<Step2SupplyProps> = ({ formData, setFormData, isViewOnly = false, setIsValid = () => {} }) => {
  const { tier, supplyConfig, allocations } = formData;

  const validation = useMemo(() => {
    const maxSupply = tier === 'FUN' ? 1_000_000 : 1_000_000_000_000;
    const minSupply = 1_000;
    const supply = Number(supplyConfig.totalSupply);
    
    const supplyError = supply < minSupply || supply > maxSupply 
      ? `Supply must be between ${minSupply.toLocaleString()} and ${maxSupply.toLocaleString()}.` 
      : null;

    const totalAllocation = allocations.reduce((sum, alloc) => sum + (Number(alloc.percent) || 0), 0);
    const allocationSumError = totalAllocation.toFixed(2) !== '100.00' ? 'Total allocation must be exactly 100%.' : null;

    let liquidityError = null;
    if (tier === 'SUPER') {
      const liquidityAlloc = allocations.find(a => a.category === 'LIQUIDITY');
      if (!liquidityAlloc) {
        liquidityError = 'SuperCoin requires a LIQUIDITY allocation.';
      } else if (liquidityAlloc.percent < 5) {
        liquidityError = 'LIQUIDITY allocation must be at least 5% for a SuperCoin.';
      }
    }

    const isValid = !supplyError && !allocationSumError && !liquidityError;
    return { supplyError, allocationSumError, liquidityError, totalAllocation, isValid };
  }, [tier, supplyConfig.totalSupply, allocations]);

  useEffect(() => {
    if (setIsValid) {
      setIsValid(validation.isValid);
    }
  }, [validation.isValid, setIsValid]);

  const handleSupplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setFormData) return;
    setFormData(prev => ({ ...prev, supplyConfig: { ...prev.supplyConfig, totalSupply: e.target.value } }));
  };

  const handleAllocationChange = (index: number, field: string, value: string | number) => {
    if (!setFormData) return;
    const newAllocations = [...allocations];
    (newAllocations[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, allocations: newAllocations }));
  };

  const addAllocation = () => {
    if (!setFormData) return;
    setFormData(prev => ({ ...prev, allocations: [...prev.allocations, { category: 'OTHER', percent: 0 }] }));
  };

  const removeAllocation = (index: number) => {
    if (!setFormData) return;
    setFormData(prev => ({ ...prev, allocations: allocations.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <SGCInput 
          label="Total Supply" 
          type="number" 
          value={supplyConfig.totalSupply} 
          onChange={handleSupplyChange} 
          required 
          disabled={isViewOnly}
        />
        {validation.supplyError && <p className="text-red-500 text-xs mt-1">{validation.supplyError}</p>}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Token Allocations</h3>
        {allocations.map((alloc, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-2 mb-2 p-2 border rounded-md bg-gray-50/50">
            <SGCInput label="Category" type="select" value={alloc.category} onChange={e => handleAllocationChange(index, 'category', e.target.value)} disabled={isViewOnly} options={ALLOCATION_CATEGORIES.map(cat => ({ value: cat, label: cat }))} />
            <SGCInput label="Percent" type="number" value={alloc.percent} onChange={e => handleAllocationChange(index, 'percent', parseFloat(e.target.value) || 0)} disabled={isViewOnly} min={0} max={100} />
            {!isViewOnly && (
              <SGCButton onClick={() => removeAllocation(index)} variant="danger" className="py-2 px-3 text-xs w-full md:w-auto mt-4 md:mt-0">Remove</SGCButton>
            )}
          </div>
        ))}
        {!isViewOnly && <SGCButton onClick={addAllocation} className="mt-2 text-sm py-1 px-2">Add Row</SGCButton>}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="text-right mb-2">
          <p className={`font-bold ${!validation.allocationSumError ? 'text-green-600' : 'text-red-500'}`}>
            Total: {validation.totalAllocation.toFixed(2)}%
          </p>
        </div>
        {!validation.isValid && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm space-y-1">
            {validation.allocationSumError && <div className="flex items-center gap-2"><AlertCircle size={16} /><span>{validation.allocationSumError}</span></div>}
            {validation.liquidityError && <div className="flex items-center gap-2"><AlertCircle size={16} /><span>{validation.liquidityError}</span></div>}
            {validation.supplyError && <div className="flex items-center gap-2"><AlertCircle size={16} /><span>{validation.supplyError}</span></div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2Supply;