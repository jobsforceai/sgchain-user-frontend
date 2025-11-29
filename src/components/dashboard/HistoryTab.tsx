'use client';

import React, { useEffect, useMemo, useState } from 'react';
import useHistoryStore from '@/stores/history.store';
import { Transaction } from '@/services/history.service';
import { ArrowDownLeft, ArrowUpRight, Clock, User, Tag, Coins } from 'lucide-react';

const HistoryTab: React.FC = () => {
  const { transactions, loading, error, fetchHistory } = useHistoryStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => filterType === 'ALL' || tx.type.toLowerCase().includes(filterType.toLowerCase()))
      .filter(tx => {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(tx).some(val => 
          String(val).toLowerCase().includes(searchLower)
        ) || tx.peerInfo?.fullName.toLowerCase().includes(searchLower);
      });
  }, [transactions, searchTerm, filterType]);

  const formatType = (type: string) => {
    return type.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) return <div className="text-center py-4">Loading history...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full rounded-md bg-white/60 backdrop-blur-sm px-3 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="w-full md:w-auto rounded-md bg-white/60 backdrop-blur-sm px-3 py-2 text-sm"
        >
          <option value="ALL">All Types</option>
          <option value="PAYMENT">Payment</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="DEPOSIT">Deposit</option>
        </select>
      </div>

      {/* Responsive Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <div key={tx.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 transition-shadow hover:shadow-md">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-full ${tx.amount < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                    {tx.amount < 0 ? <ArrowUpRight className="text-red-500" size={20} /> : <ArrowDownLeft className="text-green-500" size={20} />}
                  </span>
                  <div>
                    <p className="font-semibold">{formatType(tx.type)}</p>
                    <p className="text-xs text-gray-500 sm:hidden">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 text-right">
                  <p className={`font-mono font-semibold text-lg ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(4)} {tx.currency}
                  </p>
                  <p className="text-xs text-gray-500 hidden sm:block">{new Date(tx.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200/50 text-xs text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  <span><strong>Details:</strong> {tx.peerInfo?.fullName || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;