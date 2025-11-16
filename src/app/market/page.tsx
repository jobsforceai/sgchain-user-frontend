'use client';

import React, { useEffect, useState } from 'react';
import SGCPriceTag from '@/components/SGCPriceTag';
import { getSgcPrice } from '@/services/market.service';
import useMarketStore from '@/stores/market.store';

const MarketPage: React.FC = () => {
  const { sgcPrice, setSgcPrice } = useMarketStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const price = await getSgcPrice();
        setSgcPrice(price);
      } catch (err) {
        setError('Failed to fetch price.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 8000); // Refresh every 8 seconds

    return () => clearInterval(interval);
  }, [setSgcPrice]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Market</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {sgcPrice && <SGCPriceTag price={sgcPrice.priceUsd} symbol={sgcPrice.symbol} />}
    </div>
  );
};

export default MarketPage;
