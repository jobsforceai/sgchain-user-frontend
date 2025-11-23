'use client';

import React from 'react';
import { CreateTokenPayload, VestingType, ReleaseFrequency } from '@/services/token.service';
import SGCButton from '../SGCButton';
import SGCInput from '../SGCInput';

interface Step3VestingProps {
  formData: CreateTokenPayload;
  setFormData?: React.Dispatch<React.SetStateAction<CreateTokenPayload>>;
  isViewOnly?: boolean;
}

const VESTING_TYPES: VestingType[] = ['IMMEDIATE', 'CLIFF', 'LINEAR']; // CUSTOM is complex, skipping for now
const RELEASE_FREQUENCIES: ReleaseFrequency[] = ['DAILY', 'WEEKLY', 'MONTHLY'];

const Step3Vesting: React.FC<Step3VestingProps> = ({ formData, setFormData, isViewOnly = false }) => {
  const { allocations, vestingSchedules = [] } = formData;

  const handleVestingChange = (index: number, field: string, value: any) => {
    if (!setFormData) return;
    const newSchedules = [...vestingSchedules];
    (newSchedules[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, vestingSchedules: newSchedules }));
  };

  const addVestingSchedule = () => {
    if (!setFormData) return;
    const newSchedule = {
      allocationCategory: allocations[0]?.category || 'TEAM',
      vestingType: 'IMMEDIATE' as VestingType,
      tgePercent: 100,
      tgeTime: new Date().toISOString(),
    };
    setFormData(prev => ({
      ...prev,
      vestingSchedules: [...(prev.vestingSchedules || []), newSchedule],
    }));
  };

  const removeVestingSchedule = (index: number) => {
    if (!setFormData) return;
    const newSchedules = vestingSchedules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, vestingSchedules: newSchedules }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Vesting Schedules (Optional)</h3>
      {vestingSchedules.map((vest, index) => (
        <div key={index} className="p-4 border rounded-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SGCInput 
              label="Allocation"
              type="select"
              value={vest.allocationCategory}
              onChange={(e) => handleVestingChange(index, 'allocationCategory', e.target.value)}
              disabled={isViewOnly}
              options={allocations.map(a => ({ value: a.category, label: a.category }))}
            />
            <SGCInput
              label="Vesting Type"
              type="select"
              value={vest.vestingType}
              onChange={(e) => handleVestingChange(index, 'vestingType', e.target.value)}
              disabled={isViewOnly}
              options={VESTING_TYPES.map(t => ({ value: t, label: t }))}
            />
          </div>

          <SGCInput label="TGE %" type="number" value={vest.tgePercent} onChange={e => handleVestingChange(index, 'tgePercent', parseFloat(e.target.value))} disabled={isViewOnly} />
          <SGCInput label="TGE Time" type="date" value={vest.tgeTime.substring(0, 10)} onChange={e => handleVestingChange(index, 'tgeTime', new Date(e.target.value).toISOString())} disabled={isViewOnly} />

          {vest.vestingType === 'CLIFF' && (
            <SGCInput label="Cliff (Months)" type="number" value={vest.cliffMonths || ''} onChange={e => handleVestingChange(index, 'cliffMonths', parseInt(e.target.value))} disabled={isViewOnly} />
          )}

          {vest.vestingType === 'LINEAR' && (
             <div className="grid grid-cols-2 gap-4">
                <SGCInput label="Cliff (Months)" type="number" value={vest.cliffMonths || ''} onChange={e => handleVestingChange(index, 'cliffMonths', parseInt(e.target.value))} disabled={isViewOnly} />
                <SGCInput
                    label="Release Frequency"
                    type="select"
                    value={vest.linearReleaseFrequency}
                    onChange={(e) => handleVestingChange(index, 'linearReleaseFrequency', e.target.value)}
                    disabled={isViewOnly}
                    options={RELEASE_FREQUENCIES.map(f => ({ value: f, label: f }))}
                />
             </div>
          )}

          {!isViewOnly && <SGCButton onClick={() => removeVestingSchedule(index)} variant="danger" className="text-xs py-1 px-2">Remove Schedule</SGCButton>}
        </div>
      ))}
      {!isViewOnly && <SGCButton onClick={addVestingSchedule} className="text-sm py-1 px-2">Add Vesting Schedule</SGCButton>}
    </div>
  );
};

export default Step3Vesting;
