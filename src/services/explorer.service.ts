import api from "./api";

export interface TransactionDetails {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  gasUsed: string;
  gasPrice: string;
  confirmations?: number;
  nonce?: number;
  data?: string;
}

export const getTransactionByHash = (hash: string): Promise<TransactionDetails> =>
  api.get(`/explorer/tx/${hash}`).then(r => r.data);
