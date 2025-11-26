import React from 'react';

interface SGCCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}

const SGCCard: React.FC<SGCCardProps> = ({ children, title, className = "" }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      {title && <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default SGCCard;
