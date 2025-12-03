import api from './api';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number | null;
  timestamp: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'UNKNOWN';
  gasUsed: string;
  gasPrice: string;
}

const fetchTransaction = async (hash: string): Promise<Transaction> => {
  const response = await api.get(`/explorer/tx/${hash}`);
  return response.data;
};

const fetchRecentTransactions = async (): Promise<Transaction[]> => {
    const response = await api.get('/explorer/recent-txs');
    return response.data;
};

const explorerService = {
  fetchTransaction,
  fetchRecentTransactions
};

export default explorerService;