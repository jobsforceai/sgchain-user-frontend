import api from "./api";

export interface BankAccountRegion {
  region: string;
  fiatCurrency: string;
  bankName: string;
  accountName?: string;
  accountNumber?: string;
  ifsc?: string;
  iban?: string;
  note: string;
}

export interface SubmitDepositRequestPayload {
  bankRegion: string;
  fiatAmount: number;
  fiatCurrency: string;
  paymentProofUrl: string;
  referenceNote?: string;
}

export const fetchBankAccounts = (): Promise<{ regions: BankAccountRegion[] }> =>
  api.get("/buy/bank-accounts").then(r => r.data);

export const submitDepositRequest = (payload: SubmitDepositRequestPayload) =>
  api.post("/me/buy-sgc", payload).then(r => r.data);

export const getBuySgcRequests = (status?: 'PENDING' | 'APPROVED' | 'REJECTED') => {
  const params = status ? { status } : {};
  return api.get("/me/buy-sgc/requests", { params }).then(r => r.data);
}

export const instantBuySgc = (sgcAmount: number) =>
  api.post("/me/buy-sgc/balance", { sgcAmount }).then(r => r.data);
