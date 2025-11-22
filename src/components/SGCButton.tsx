import React from 'react';

interface SGCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
}

const SGCButton: React.FC<SGCButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = "font-bold cursor-pointer py-2 px-4 rounded-lg transition-colors duration-200";
  
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-700 text-white",
    danger: "bg-red-400 hover:bg-red-600 text-white",
  };

  const mergedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

  return (
    <button
      {...props}
      className={mergedClasses.trim()}
    >
      {children}
    </button>
  );
};

export default SGCButton;
