"use client";
import React, { useState } from 'react';

interface SGCInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  options?: { value: string; label: string }[];
}

const SGCInput: React.FC<SGCInputProps> = ({ label, type, options = [], ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { value } = props;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  // Static label for select, date, etc.
  if (type === 'select') {
    const commonClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.id}>
          {label}
        </label>
        <select
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          className={commonClasses}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const hasValue = value != null && value.toString().length > 0;
  const isLabelUp = isFocused || hasValue;

  // Floating label for text-like inputs
  return (
    <div className="relative mb-4">
      <label
        htmlFor={props.id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none ${
          isLabelUp
            ? 'top-1 text-xs text-gray-500'
            : 'top-1/2 -translate-y-1/2 text-gray-400'
        }`}
      >
        {label}
      </label>
      <input
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        type={type}
        placeholder={isLabelUp ? props.placeholder : ''}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-3 pt-5 pb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow appearance-none text-gray-700 leading-tight"
      />
    </div>
  );
};

export default SGCInput;