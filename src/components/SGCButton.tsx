import React from 'react';

interface SGCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'brand' | 'success' | 'danger' | 'outline';
}

const SGCButton: React.FC<SGCButtonProps> = ({ children, className = '', variant = 'primary', disabled, ...props }) => {
  const base = 'font-semibold cursor-pointer py-2 px-4 rounded-lg transition-colors duration-200 inline-flex items-center justify-center';

  const variants: Record<string, string> = {
    primary: 'bg-[var(--sg-dark)] hover:bg-[#2b2b2b] text-white',
    brand: 'bg-[var(--sg-primary)] hover:bg-[#0019cc] text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50',
  };

  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.primary} ${disabledClasses} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default SGCButton;
