import React from 'react';

interface SGCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SGCButton: React.FC<SGCButtonProps> = ({ children, className, ...props }) => {
  const baseClasses = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  const mergedClasses = `${baseClasses} ${className || ''}`;

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
