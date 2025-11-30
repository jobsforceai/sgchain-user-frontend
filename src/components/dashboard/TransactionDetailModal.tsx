'use client';

import React from 'react';
import useExplorerStore from '@/stores/explorer.store';
import Modal from '../Modal';
import SGCButton from '../SGCButton';
import SGCCard from '../SGCCard';
import { CheckCircle2, AlertCircle, Clock, Loader } from 'lucide-react';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode; isHash?: boolean }> = ({ label, value, isHash = false }) => (
  <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-gray-100">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className={`mt-1 sm:mt-0 text-sm text-gray-900 ${isHash ? 'font-mono break-all' : ''}`}>{value}</dd>
  </div>
);

const StatusBadge: React.FC<{ status: 'SUCCESS' | 'FAILED' | 'PENDING' }> = ({ status }) => {
  const styles = {
    SUCCESS: { icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-800' },
    FAILED: { icon: <AlertCircle size={16} />, color: 'bg-red-100 text-red-800' },
    PENDING: { icon: <Clock size={16} />, color: 'bg-yellow-100 text-yellow-800' },
  };
  const current = styles[status] || styles.PENDING;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${current.color}`}>
      {current.icon}
      {status}
    </span>
  );
};

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ isOpen, onClose }) => {
  const { transactionDetails, loading, error, clearTransaction } = useExplorerStore();

  const handleClose = () => {
    clearTransaction();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <SGCCard title="Transaction Details" className="w-full max-w-2xl">
        {loading && (
          <div className="flex items-center justify-center h-48">
            <Loader className="animate-spin" />
            <p className="ml-2">Fetching details...</p>
          </div>
        )}
        {error && <p className="text-red-500 bg-red-50 p-3 rounded-md text-center">{error}</p>}
        {transactionDetails && (
          <dl>
            <DetailRow label="Status" value={<StatusBadge status={transactionDetails.status} />} />
            <DetailRow label="Transaction Hash" value={transactionDetails.hash} isHash />
            <DetailRow label="From" value={transactionDetails.from} isHash />
            <DetailRow label="To" value={transactionDetails.to} isHash />
            <DetailRow label="Value" value={`${transactionDetails.value} SGC`} />
            <DetailRow label="Block Number" value={transactionDetails.blockNumber} />
            <DetailRow label="Timestamp" value={new Date(transactionDetails.timestamp * 1000).toLocaleString()} />
            <DetailRow label="Gas Used" value={transactionDetails.gasUsed} />
            <DetailRow label="Gas Price" value={`${transactionDetails.gasPrice} Gwei`} />
          </dl>
        )}
        <div className="flex justify-end mt-6">
          <SGCButton onClick={handleClose}>Close</SGCButton>
        </div>
      </SGCCard>
    </div>
  );
};

export default TransactionDetailModal;
