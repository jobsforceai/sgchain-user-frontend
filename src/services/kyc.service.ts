import api from "./api";

export type KycRegion = 'INDIA' | 'DUBAI';
export type KycDocumentType = 'PASSPORT' | 'DRIVING_LICENSE' | 'NATIONAL_ID' | 'SELFIE' | 'PROOF_OF_ADDRESS';
export type KycStatusValue = 'DRAFT' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface KycDocument {
  _id: string;
  region: KycRegion;
  documentType: KycDocumentType;
  documentUrl: string;
  documentBackUrl?: string;
}

export interface KycStatus {
  _id: string;
  region: KycRegion;
  status: KycStatusValue;
  documents: KycDocument[];
  rejectionReason?: string;
}

export interface UploadDocumentPayload {
  region: KycRegion;
  documentType: KycDocumentType;
  documentUrl: string;
  documentBackUrl?: string;
}

export const getKycStatus = (): Promise<{ items: KycStatus[] }> =>
  api.get("/me/kyc/status").then(r => r.data);

export const uploadKycDocument = (payload: UploadDocumentPayload) =>
  api.post("/me/kyc/upload", payload).then(r => r.data);

export const submitKycForReview = (region: KycRegion) =>
  api.post("/me/kyc/submit", { region }).then(r => r.data);
