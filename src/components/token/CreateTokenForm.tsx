'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useTokenStore from '@/stores/token.store';
import { CreateTokenPayload, TokenTier, TokenAllocation } from '@/services/token.service';
import Step1Details from './Step1Details';
import Step2Supply from './Step2Supply';
import Step3Vesting from './Step3Vesting';
import Step4Review from './Step4Review';
import SGCButton from '../SGCButton';
import { Check } from 'lucide-react';

const STEPS = ['Details', 'Supply & Allocation', 'Vesting Schedule', 'Review & Create'];

const Stepper: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-8 flex-wrap">
    {STEPS.map((step, index) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center w-1/4 min-w-[80px]">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              index < currentStep ? 'bg-green-500 text-white' : index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index < currentStep ? <Check /> : index + 1}
          </div>
          <p className={`mt-2 text-xs text-center ${index <= currentStep ? 'font-semibold text-gray-700' : 'text-gray-500'}`}>{step}</p>
        </div>
        {index < STEPS.length - 1 && <div className={`flex-1 h-1 mx-2 hidden sm:block ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

const CreateTokenForm: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { createDraft, loading, error } = useTokenStore();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<CreateTokenPayload>({
    tier: 'FUN',
    metadata: { name: '', symbol: '', decimals: 18 },
    supplyConfig: { totalSupply: '1000000', isFixedSupply: true },
    allocations: [{ category: 'CREATOR', percent: 100 }],
    vestingSchedules: [],
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const updateFormData = (data: Partial<CreateTokenPayload>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    try {
      const newDraft = await createDraft(formData as CreateTokenPayload);
      if (newDraft) {
        router.push(`/token/${newDraft._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1Details formData={formData} setFormData={setFormData} />;
      case 1: return <Step2Supply formData={formData} setFormData={setFormData} />;
      case 2: return <Step3Vesting formData={formData} setFormData={setFormData} />;
      case 3: return (
        <div>
          <h3 className="text-lg font-semibold">Review Your Token</h3>
          <div className="p-4 border rounded-md bg-gray-50 space-y-2 mt-4">
            <p><strong>Name:</strong> {formData.metadata.name}</p>
            <p><strong>Symbol:</strong> {formData.metadata.symbol}</p>
            <p><strong>Total Supply:</strong> {Number(formData.supplyConfig.totalSupply).toLocaleString()}</p>
            <p><strong>Tier:</strong> {formData.tier}</p>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-xl p-6 md:p-8 shadow-lg">
      <Stepper currentStep={currentStep} />
      <div className="min-h-[300px]">
        {renderStep()}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center sm:items-end">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          {currentStep > 0 && (
            <SGCButton onClick={handleBack} disabled={loading} variant="outline" className="w-full">Back</SGCButton>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <SGCButton onClick={onCancel} disabled={loading} className="bg-gray-200 text-gray-700 hover:bg-gray-300 w-full">Cancel</SGCButton>
          {currentStep < STEPS.length - 1 ? (
            <SGCButton onClick={handleNext} className="w-full">Next</SGCButton>
          ) : (
            <SGCButton onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? 'Saving Draft...' : 'Save Draft & Continue'}
            </SGCButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTokenForm;
