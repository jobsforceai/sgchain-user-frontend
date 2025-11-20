import api from "./api";

export type WithdrawalType = 'BANK' | 'CRYPTO';
export type BankRegion = 'INDIA' | 'DUBAI';
export type CryptoNetwork = 'TRC20' | 'ERC20' | 'BTC';

interface BaseWithdrawalDetails {
  region?: BankRegion;
}

export interface IndiaBankWithdrawalDetails extends BaseWithdrawalDetails {
  region: 'INDIA';
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface DubaiBankWithdrawalDetails extends BaseWithdrawalDetails {
  region: 'DUBAI';
  beneficiaryName: string;
  iban: string;
  swiftBic: string;
  bankName: string;
}

export interface CryptoWithdrawalDetails {
  network: CryptoNetwork;
  address: string;
}

export type WithdrawalDetails = IndiaBankWithdrawalDetails | DubaiBankWithdrawalDetails | CryptoWithdrawalDetails;

export interface WithdrawalRequestPayload {
  amountUsd: number;
  withdrawalType: WithdrawalType;
  withdrawalDetails: WithdrawalDetails;
}

export interface Withdrawal {
  _id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  amountUsd: number;
  withdrawalType: WithdrawalType;
  withdrawalDetails: WithdrawalDetails;
  createdAt: string;
  adminNotes?: string;
}

export const requestWithdrawal = (payload: WithdrawalRequestPayload) =>
  api.post("/me/withdrawals/request", payload).then(r => r.data);

export const getWithdrawalHistory = (): Promise<{ items: Withdrawal[] }> =>
  api.get("/me/withdrawals").then(r => r.data);
