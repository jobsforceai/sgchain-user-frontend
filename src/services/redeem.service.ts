import api from "./api";

export const redeemSagenexTransfer = (transferCode: string) =>
  api.post("/me/redeem-transfer", { transferCode }).then(r => r.data);
