import api from "./api";
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

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
    baseURL: API_BASE_URL,
  });

  return walletApi.get("/me/wallet/details", {
    headers: {
      Authorization: `Bearer ${walletAccessToken}`
    }
  }).then(r => r.data);
};
