import React from 'react';

interface SGCCardProps {
  children: React.ReactNode;
  title?: string;
}

const SGCCard: React.FC<SGCCardProps> = ({ children, title }) => {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
      {children}
    </div>
  );
};

export default SGCCard;
