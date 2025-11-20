'use client';

import React, { useEffect, useMemo } from 'react';
import useHistoryStore from '@/stores/history.store';
import SGCCard from '@/components/SGCCard';
import { Transaction } from '@/services/history.service';

// A new type for our processed (potentially grouped) transactions
type ProcessedTransaction = Transaction & {
  groupedAmount?: {
    sgc: number;
    usd: number;
  };
};

const TransactionRow: React.FC<{ tx: ProcessedTransaction }> = ({ tx }) => {
  const isDebit = tx.amount < 0;
  const amountColor = isDebit ? 'text-red-600' : 'text-green-600';

  const formatType = (type: string) => {
    return type
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Special rendering for grouped "Buy SGC" transactions
  if (tx.type === 'BUY_SGC_WITH_USD_BALANCE' && tx.groupedAmount) {
    return (
      <tr>
        <td className="py-2 px-4 border-b">{new Date(tx.createdAt).toLocaleString()}</td>
        <td className="py-2 px-4 border-b">{formatType(tx.type)}</td>
        <td className="py-2 px-4 border-b font-mono">
          <div className="text-green-600">+{tx.groupedAmount.sgc.toFixed(4)} SGC</div>
          <div className="text-red-600">{tx.groupedAmount.usd.toFixed(2)} USD</div>
        </td>
        <td className="py-2 px-4 border-b text-sm text-gray-600">
          Tx: {tx.meta.onchainTxHash?.substring(0, 10)}...
        </td>
      </tr>
    );
  }

  // Special rendering for grouped "Sell SGC" transactions
  if ((tx.type === 'SELL_SGC_DEBIT' || tx.type === 'SELL_SGC_CREDIT') && tx.groupedAmount) {
    return (
      <tr>
        <td className="py-2 px-4 border-b">{new Date(tx.createdAt).toLocaleString()}</td>
        <td className="py-2 px-4 border-b">Sell SGC</td>
        <td className="py-2 px-4 border-b font-mono">
          <div className="text-red-600">{tx.groupedAmount.sgc.toFixed(4)} SGC</div>
          <div className="text-green-600">+{tx.groupedAmount.usd.toFixed(2)} USD</div>
        </td>
        <td className="py-2 px-4 border-b text-sm text-gray-600">
          Tx: {tx.meta.onchainTxHash?.substring(0, 10)}...
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="py-2 px-4 border-b">{new Date(tx.createdAt).toLocaleString()}</td>
      <td className="py-2 px-4 border-b">{formatType(tx.type)}</td>
      <td className={`py-2 px-4 border-b font-mono ${amountColor}`}>
        {isDebit ? '' : '+'}
        {tx.amount.toFixed(4)} {tx.currency}
      </td>
      <td className="py-2 px-4 border-b text-sm text-gray-600">
        {tx.peerInfo ? `To: ${tx.peerInfo.fullName}` : ''}
      </td>
    </tr>
  );
};

const HistoryPage: React.FC = () => {
  const { transactions, loading, error, fetchHistory } = useHistoryStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const groupedTransactions = useMemo(() => {
    const processed: ProcessedTransaction[] = [];
    const processedHashes = new Set<string>();

    for (const tx of transactions) {
      const txHash = tx.meta.onchainTxHash;
      if (txHash && (tx.type === 'BUY_SGC_WITH_USD_BALANCE' || tx.type.startsWith('SELL_SGC'))) {
        if (processedHashes.has(txHash)) {
          continue; // Already processed this pair
        }

        const pairTx = transactions.find(
          p => p.meta.onchainTxHash === txHash && p.id !== tx.id
        );

        if (pairTx) {
          const sgcTx = tx.currency === 'SGC' ? tx : pairTx;
          const usdTx = tx.currency === 'USD' ? tx : pairTx;

          processed.push({
            ...sgcTx,
            groupedAmount: {
              sgc: sgcTx.amount,
              usd: usdTx.amount,
            },
          });
          processedHashes.add(txHash);
        } else {
          processed.push(tx);
        }
      } else {
        processed.push(tx);
      }
    }
    return processed;
  }, [transactions]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      <SGCCard>
        {loading && <p>Loading history...</p>}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Type</th>
                  <th className="py-2 px-4 border-b text-left">Amount</th>
                  <th className="py-2 px-4 border-b text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {groupedTransactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)}
              </tbody>
            </table>
          </div>
        )}
      </SGCCard>
    </div>
  );
};

export default HistoryPage;
