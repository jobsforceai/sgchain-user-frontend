import api from "./api";

export const redeemSagenexTransfer = (transferCode: string): Promise<{ usdBalanceAfter: number }> =>
  api.post("/me/redeem-transfer", { transferCode }).then(r => r.data);

export interface RedeemSgTradingResponse {
  status: 'SUCCESS';
  creditedUsdAmount: number;
  usdBalanceAfter: number;
}
export const redeemSgTradingTransfer = (code: string): Promise<RedeemSgTradingResponse> =>
  api.post("/me/redeem/sgtrading", { code }).then(r => r.data);