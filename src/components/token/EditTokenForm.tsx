'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/token.store';
import { CreateTokenPayload, TokenLaunch } from '@/services/token.service';
import SGCButton from '../SGCButton';
import Step1Details from './Step1Details';
import Step2Supply from './Step2Supply';
import Step3Vesting from './Step3Vesting';
import Step4Review from './Step4Review';
import SGCCard from '../SGCCard';

interface EditTokenFormProps {
  id: string;
  isViewOnly?: boolean;
}

const steps = ['Details', 'Supply & Allocation', 'Vesting', 'Review & Deploy'];

const EditTokenForm: React.FC<EditTokenFormProps> = ({ id, isViewOnly = false }) => {
  const router = useRouter();
  const { currentToken, updateDraft, loading, error } = useTokenStore();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateTokenPayload | null>(null);

  useEffect(() => {
    if (currentToken) {
      setFormData({
        tier: currentToken.tier,
        metadata: currentToken.metadata,
        supplyConfig: currentToken.supplyConfig,
        allocations: currentToken.allocations,
        vestingSchedules: currentToken.vestingSchedules,
      });
    }
  }, [currentToken]);

  const handleSave = async () => {
    if (formData) {
      await updateDraft(id, formData);
    }
  };

  const isStepComplete = () => {
    if (!formData) return false;
    switch (activeStep) {
      case 0:
        return formData.metadata.name.trim() !== '' && formData.metadata.symbol.trim() !== '';
      case 1:
        const totalSupply = Number(formData.supplyConfig.totalSupply);
        const maxSupply = formData.tier === 'FUN' ? 1000000 : 1000000000000;
        if (totalSupply < 1000 || totalSupply > maxSupply) return false;

        const totalAllocation = formData.allocations.reduce((sum, alloc) => sum + (Number(alloc.percent) || 0), 0);
        if (totalAllocation !== 100) return false;

        if (formData.tier === 'SUPER') {
          const liquidityAlloc = formData.allocations.find(a => a.category === 'LIQUIDITY');
          if (!liquidityAlloc || liquidityAlloc.percent < 5) {
            return false;
          }
        }
        return true;
      default:
        return true;
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      router.back();
    } else {
      setActiveStep(s => s - 1);
    }
  };

  if (loading && !currentToken) {
    return <p>Loading token details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!currentToken || !formData) {
    return <p>Token not found.</p>;
  }

  return (
    <SGCCard>
      <div className="mb-8">
        <nav className="flex justify-center border-b">
          {steps.map((step, index) => {
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            
            let buttonClass = 'text-gray-500 hover:text-gray-700';
            if (isActive) {
              buttonClass = 'border-b-2 border-blue-500 text-blue-600';
            } else if (isCompleted) {
              buttonClass = 'border-b-2 border-green-500 text-green-600';
            }

            return (
              <button
                key={step}
                onClick={() => {
                  if (isViewOnly) {
                    setActiveStep(index);
                  } else if (isCompleted || isActive) {
                    setActiveStep(index);
                  }
                }}
                className={`py-4 px-6 text-sm font-medium transition-colors ${buttonClass}`}
                disabled={!isViewOnly ? (!isCompleted && !isActive) : false}
              >
                {step}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeStep === 0 && <Step1Details formData={formData} setFormData={!isViewOnly ? setFormData as React.Dispatch<React.SetStateAction<CreateTokenPayload>> : undefined} isViewOnly={isViewOnly} />}
        {activeStep === 1 && <Step2Supply formData={formData} setFormData={!isViewOnly ? setFormData as React.Dispatch<React.SetStateAction<CreateTokenPayload>> : undefined} isViewOnly={isViewOnly} />}
        {activeStep === 2 && <Step3Vesting formData={formData} setFormData={!isViewOnly ? setFormData as React.Dispatch<React.SetStateAction<CreateTokenPayload>> : undefined} isViewOnly={isViewOnly} />}
        {activeStep === 3 && <Step4Review formData={formData} id={id} isViewOnly={isViewOnly} />}
      </div>

      <div className="flex justify-between mt-8 border-t pt-6">
        <SGCButton onClick={handleBack}>
          Back
        </SGCButton>
        
        {!isViewOnly ? (
          <div className="flex gap-4">
            <SGCButton onClick={handleSave} disabled={loading} className="bg-green-500 hover:bg-green-700">
              {loading ? 'Saving...' : 'Save Changes'}
            </SGCButton>
            <SGCButton 
              onClick={() => setActiveStep(s => Math.min(steps.length - 1, s + 1))} 
              disabled={!isStepComplete() || activeStep === steps.length - 1}
            >
              Next
            </SGCButton>
          </div>
        ) : (
          <div className="flex gap-4">
            <SGCButton 
              onClick={() => setActiveStep(s => Math.min(steps.length - 1, s + 1))} 
              disabled={activeStep === steps.length - 1}
            >
              Next
            </SGCButton>
          </div>
        )}
      </div>
    </SGCCard>
  );
};

export default EditTokenForm;
