import api from './api';

export interface LiquidityInterestPayload {
  email: string;
  principalAmountUsd: number;
  durationMonths: number;
}

export interface CompanyRegistrationPayload {
  companyName: string;
  businessType: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  additionalInfo?: string;
}

export const formsService = {
  submitLiquidityInterest: (data: LiquidityInterestPayload) => {
    return api.post('/forms/liquidity-interest', data);
  },
  submitCompanyRegistration: (data: CompanyRegistrationPayload) => {
    return api.post('/forms/company-registration', data);
  },
};
