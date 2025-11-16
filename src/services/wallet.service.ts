import api from "./api";

export const fetchWallet = () => 
  api.get("/me/wallet").then(r => r.data);
