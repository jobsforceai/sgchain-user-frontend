'use client';

import React from 'react';
import useTransactionStore from '@/stores/transaction.store';
import SGCCard from '../SGCCard';
import Tabs from '../Tabs';
import { CubeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const LiveTransactions: React.FC = () => {
  const { pendingTransactions, recentBlocks, isConnected } = useTransactionStore();

  const formatTimestamp = (hexTimestamp: string) => {
    if (!hexTimestamp) return 'N/A';
    const timestamp = parseInt(hexTimestamp, 16) * 1000;
    return new Date(timestamp).toLocaleString();
  };

  const PendingTransactionsView = () => (
    <div className="relative h-80 overflow-y-auto">
      {pendingTransactions.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/70 backdrop-blur-sm sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingTransactions.map((tx, index) => (
              <tr key={`${tx.hash}-${index}`} className="animate-fade-in">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-700 hover:text-blue-600 transition-colors">
                  {tx.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Waiting for new transactions...</p>
        </div>
      )}
    </div>
  );

  const LatestBlocksView = () => (
    <div className="relative h-80 overflow-y-auto p-1 space-y-2">
      {recentBlocks.length > 0 ? (
        recentBlocks.map((block, index) => (
          <div
            key={block.hash}
            className="p-3 bg-white/80 border border-gray-200/80 rounded-lg shadow-sm animate-fade-in-down transition-all duration-300"
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 1 - (index / 8),
              transform: `scale(${1 - (index / 50)})`,
             }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <CubeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-md text-blue-700">Block #{parseInt(block.number, 16)}</p>
                    <p className="text-xs text-gray-500">{formatTimestamp(block.timestamp)}</p>
                  </div>
              </div>
              <p className="text-xs text-gray-400">Gas Used: {parseInt(block.gasUsed, 16)}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <DocumentDuplicateIcon className="h-3 w-3" />
                Block Hash
              </p>
              <p className="font-mono text-xs break-all text-gray-600">{block.hash}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Waiting for new blocks...</p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { label: 'Pending Transactions', content: <PendingTransactionsView /> },
    { label: 'Latest Blocks', content: <LatestBlocksView /> },
  ];

  return (
    <SGCCard title="Live Feed" className="sgc-glass rounded-xl h-full">
        <div className="relative">
            {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10 rounded-xl">
                    <p className="text-gray-500">Connecting to live feed...</p>
                </div>
            )}
            <Tabs tabs={tabs} />
        </div>
        <div className="pt-2 text-xs text-gray-400 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            {isConnected ? 'Connected' : 'Connecting...'}
        </div>
    </SGCCard>
  );
};

export default LiveTransactions;
