'use client';

import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';

interface SGCOtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SGCOtpInput: React.FC<SGCOtpInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const processInput = (newOtp: string[]) => {
    const numericOtp = newOtp.join('').replace(/[^0-9]/g, '');
    onChange(numericOtp.slice(0, length));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const inputVal = e.target.value;
    const newOtp = value.split('');
    
    // Only handle single digit changes
    if (inputVal.length <= 1) {
      newOtp[index] = inputVal;
      processInput(newOtp);

      if (inputVal !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      // If the current input is empty, move to the previous one and clear it
      if (!value[index] && index > 0) {
        const newOtp = value.split('');
        newOtp[index - 1] = '';
        processInput(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    processInput(pastedData.split(''));
    
    // Focus on the last filled input
    const lastFilledIndex = Math.min(length - 1, pastedData.length - 1);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  return (
    <div className="flex justify-center space-x-2">
      {[...Array(length)].map((_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(el) => (inputRefs.current[index] = el)}
          className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default SGCOtpInput;
