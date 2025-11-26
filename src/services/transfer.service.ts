import api from "./api";
import Cookies from "js-cookie";

export interface ExternalTransferPayload {
  amountSgc: number;
}

export interface ExternalTransferResponse {
  transferId: string;
  code: string;
  amountSgc: number;
  amountUsd: number;
  status: 'PENDING_CLAIM';
}

export const createExternalTransfer = async (payload: ExternalTransferPayload): Promise<ExternalTransferResponse> => {
    const token = Cookies.get('sgchain_access_token');
    const { data } = await api.post('/me/transfer/external', payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};
