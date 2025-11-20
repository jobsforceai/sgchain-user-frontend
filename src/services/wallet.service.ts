import api from "./api";
import Cookies from 'js-cookie';
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const fetchWallet = () =>
  api.get("/me/wallet").then(r => r.data);

export const setWalletPin = (pin: string) =>
  api.post("/me/wallet/set-pin", { pin }).then(r => r.data);

export const verifyWalletPin = (pin: string) =>
  api.post("/me/wallet/verify-pin", { pin }).then(r => r.data);

export const getWalletDetails = () => {
  const walletAccessToken = Cookies.get('wallet_access_token');
  
  // Create a new axios instance without the interceptor for this specific call
  const walletApi = axios.create({
    baseURL,
  });

  return walletApi.get("/me/wallet/details", {
    headers: {
      Authorization: `Bearer ${walletAccessToken}`
    }
  }).then(r => r.data);
};
