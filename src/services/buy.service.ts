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

export interface SubmitBuyRequestPayload {
  paymentProof: File;
  bankRegion: string;
  fiatAmount: number;
  fiatCurrency: string;
  referenceNote?: string;
}

export const fetchBankAccounts = (): Promise<{ regions: BankAccountRegion[] }> =>
  api.get("/buy/bank-accounts").then(r => r.data);

export const submitBuyRequest = (payload: SubmitBuyRequestPayload) => {
  const formData = new FormData();
  formData.append('paymentProof', payload.paymentProof);
  formData.append('bankRegion', payload.bankRegion);
  formData.append('fiatAmount', payload.fiatAmount.toString());
  formData.append('fiatCurrency', payload.fiatCurrency);
  if (payload.referenceNote) {
    formData.append('referenceNote', payload.referenceNote);
  }

  return api.post("/me/buy-sgc", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);
};

export const getBuySgcRequests = (status?: 'PENDING' | 'APPROVED' | 'REJECTED') => {
  const params = status ? { status } : {};
  return api.get("/me/buy-sgc/requests", { params }).then(r => r.data);
}

export const instantBuySgc = (sgcAmount: number) =>
  api.post("/me/buy-sgc/balance", { sgcAmount }).then(r => r.data);
