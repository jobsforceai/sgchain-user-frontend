import api from "./api";

export type KycRegion = 'INDIA' | 'DUBAI';
export type KycStatusValue = 'DRAFT' | 'PENDING' | 'VERIFIED' | 'REJECTED';

// This is the type for what the backend *returns* in the status
export type KycDocumentType = 'PASSPORT' | 'DRIVING_LICENSE' | 'NATIONAL_ID' | 'SELFIE' | 'PROOF_OF_ADDRESS';

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

// This is the new type for what the frontend *sends* during file upload
export type KycUploadDocumentType = 
  | 'AADHAAR_FRONT' 
  | 'AADHAAR_BACK'
  | 'PASSPORT' 
  | 'NATIONAL_ID' // For Emirates ID
  | 'SELFIE';

export const getKycStatus = (): Promise<{ items: KycStatus[] }> =>
  api.get("/me/kyc/status").then(r => r.data);

export const uploadKycDocumentFile = (file: File, docType: KycUploadDocumentType, region: KycRegion) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('docType', docType);
  formData.append('region', region);

  return api.post("/me/kyc/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data);
};

export const submitKycForReview = (region: KycRegion) =>
  api.post("/me/kyc/submit", { region }).then(r => r.data);
