import React from 'react';

interface SGCInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const SGCInput: React.FC<SGCInputProps> = ({ label, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.id}>
        {label}
      </label>
      <input
        {...props}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default SGCInput;
