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
      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-md bg-white/60 backdrop-blur-sm px-3 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2"
          style={{ boxShadow: '0 0 0 3px rgba(1,33,203,0.12)' }}
        />

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="rounded-md bg-white/60 backdrop-blur-sm px-3 py-2 text-sm"
        >
          <option value="ALL">All</option>
          <option value="PAYMENT">Payment</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="DEPOSIT">Deposit</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="rounded-md bg-white/60 backdrop-blur-sm">
          <table className="min-w-full text-gray-800">
            <thead>
              <tr className="bg-white/30 sticky top-0">
                <th className="py-2 px-4 text-left font-semibold">Date</th>
                <th className="py-2 px-4 text-left font-semibold">Type</th>
                <th className="py-2 px-4 text-left font-semibold">Amount</th>
                <th className="py-2 px-4 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>}
              {error && <tr><td colSpan={4} className="text-center py-4 text-red-500">{error}</td></tr>}
              {!loading && filteredTransactions.map((tx, idx) => (
                <tr key={tx.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white/0' : 'bg-white/20'} hover:bg-white/30`}>
                  <td className="py-2 px-4 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="py-2 px-4 text-sm">{formatType(tx.type)}</td>
                  <td className={`py-2 px-4 font-mono text-sm ${tx.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(4)} {tx.currency}
                  </td>
                  <td className="py-2 px-4 text-sm">{tx.peerInfo?.fullName || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
