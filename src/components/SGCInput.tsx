import React from 'react';

interface SGCInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  options?: { value: string; label: string }[];
}

const SGCInput: React.FC<SGCInputProps> = ({ label, type, options = [], ...props }) => {
  const commonClasses = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.id}>
        {label}
      </label>
      {type === 'select' ? (
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
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          className={commonClasses}
        />
      )}
    </div>
  );
};

export default SGCInput;
