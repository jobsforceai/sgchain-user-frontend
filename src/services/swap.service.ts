import api from "./api";
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

export interface QuotePayload {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
}

export interface QuoteResponse {
  amountOut: string;
}

export interface ExecuteSwapPayload {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippage?: number;
}

export interface ExecuteSwapResponse {
  status: string;
  txHash: string;
  amountIn: string;
  tokenIn: string;
  tokenOut: string;
  expectedAmountOut: string;
  minAmountOut: string;
}

export const getQuote = (params: QuotePayload): Promise<QuoteResponse> =>
  api.get("/swap/quote", { params }).then(r => r.data);

export const executeSwap = (payload: ExecuteSwapPayload): Promise<ExecuteSwapResponse> => {
    const walletAccessToken = Cookies.get('wallet_access_token');

    // Create a new axios instance for this specific call to use the wallet access token
    const swapApi = axios.create({
      baseURL: API_BASE_URL,
    });
  
    return swapApi.post("/swap/execute", payload, {
      headers: {
        Authorization: `Bearer ${walletAccessToken}`
      }
    }).then(r => r.data);
}
