import React from 'react';

interface SGCPriceTagProps {
  price: number;
  symbol: string;
}

const SGCPriceTag: React.FC<SGCPriceTagProps> = ({ price, symbol }) => {
  return (
    <div className="flex items-center">
      <span className="text-2xl font-bold">${price.toFixed(2)}</span>
      <span className="text-gray-500 ml-2">{symbol}</span>
    </div>
  );
};

export default SGCPriceTag;
