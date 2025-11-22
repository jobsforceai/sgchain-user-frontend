'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useHistoryStore from '@/stores/history.store';
import { Transaction } from '@/services/history.service';

const HistoryTab: React.FC = () => {
  const { transactions, loading, error, fetchHistory } = useHistoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        if (filterType === 'ALL') return true;
        return tx.type.toLowerCase().includes(filterType.toLowerCase());
      })
      .filter(tx => {
        const searchLower = searchTerm.toLowerCase();
        return tx.type.toLowerCase().includes(searchLower) ||
               tx.currency.toLowerCase().includes(searchLower) ||
               (tx.peerInfo?.fullName && tx.peerInfo.fullName.toLowerCase().includes(searchLower));
      });
  }, [transactions, searchTerm, filterType]);

  const formatType = (type: string) => {
    return type.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {/* Add filter dropdown if needed */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-gray-800">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left font-semibold">Date</th>
              <th className="py-2 px-4 text-left font-semibold">Type</th>
              <th className="py-2 px-4 text-left font-semibold">Amount</th>
              <th className="py-2 px-4 text-left font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>}
            {error && <tr><td colSpan={4} className="text-center py-4 text-red-500">{error}</td></tr>}
            {!loading && filteredTransactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-200">
                <td className="py-2 px-4">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4">{formatType(tx.type)}</td>
                <td className={`py-2 px-4 font-mono ${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(4)} {tx.currency}
                </td>
                <td className="py-2 px-4">{tx.peerInfo?.fullName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTab;
