import api from "./api";

export interface Transaction {
  id: string;
  type: string;
  currency: 'SGC' | 'USD';
  amount: number;
  meta: any;
  createdAt: string;
  peerInfo: {
    userId: string;
    fullName: string;
    email: string;
  } | null;
}

export const getHistory = (): Promise<{ items: Transaction[] }> =>
  api.get("/me/history").then(r => r.data);
