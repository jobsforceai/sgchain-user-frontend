'use client';

import React from 'react';
import useTransactionStore from '@/stores/transaction.store';
import SGCCard from '../SGCCard';

const LiveTransactions: React.FC = () => {
  const { transactions, isConnected } = useTransactionStore();

  const formatAddress = (address: string | null) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  const formatTimestamp = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString();
  };

  return (
    <SGCCard title="Live Transaction Feed">
        <div className="relative h-96 overflow-y-auto">
            {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50">
                    <p className="text-gray-500">Connecting to live feed...</p>
                </div>
            )}
            {isConnected && transactions.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Waiting for new transactions...</p>
                </div>
            )}
            {transactions.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hash</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value (SGC)</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((tx) => (
                        <tr key={tx.hash} className="animate-fade-in">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{formatAddress(tx.hash)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{formatAddress(tx.from)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-700">{formatAddress(tx.to)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">{parseFloat(tx.value).toFixed(4)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500">{formatTimestamp(tx.timestamp)}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
        <div className="pt-2 text-xs text-gray-400 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            {isConnected ? 'Connected' : 'Connecting...'}
        </div>
    </SGCCard>
  );
};

export default LiveTransactions;
