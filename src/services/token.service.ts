import api from "./api";

// Enums
export type TokenTier = 'FUN' | 'SUPER';
export type AllocationCategory = 
  | 'CREATOR' | 'TEAM' | 'TREASURY' | 'COMMUNITY' | 'LIQUIDITY' 
  | 'ADVISORS' | 'MARKETING' | 'AIRDROP' | 'RESERVE' | 'OTHER';
export type VestingType = 'IMMEDIATE' | 'CLIFF' | 'LINEAR' | 'CUSTOM';
export type ReleaseFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type TokenStatus = 'DRAFT' | 'PENDING_PAYMENT' | 'DEPLOYING' | 'DEPLOYED' | 'FAILED';


export interface TokenAllocation {
  category: AllocationCategory;
  label?: string; // Optional label for 'OTHER'
  percent: number; // 0-100 (e.g., 15.5)
  targetWalletAddress?: string; // Optional, defaults to creator if empty
}

export interface VestingSchedule {
  allocationCategory: AllocationCategory; // Links to the allocation above
  vestingType: VestingType;
  tgePercent: number; // % released at launch
  tgeTime: string; // ISO Date string (e.g., "2024-12-25T00:00:00Z")
  cliffMonths?: number; // For CLIFF/LINEAR
  linearReleaseFrequency?: ReleaseFrequency; // For LINEAR
  customTranches?: { unlockTime: string; percent: number }[]; // For CUSTOM
}

// Payload for Creation/Update
export interface CreateTokenPayload {
  tier: TokenTier;
  metadata: {
    name: string;
    symbol: string;
    decimals?: number; // Default 18
    logoUrl?: string;
    description?: string;
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
  };
  supplyConfig: {
    totalSupply: string; // String for BigInt (e.g. "1000000")
    isFixedSupply: boolean; // Always true for now
  };
  allocations: TokenAllocation[];
  vestingSchedules?: VestingSchedule[];
}

export interface TokenLaunch extends CreateTokenPayload {
    _id: string;
    userId: string;
    status: TokenStatus;
    deploymentFeeSgc: number;
    onchainData?: {
        tokenAddress: string;
        txHash: string;
        deployedAt: string;
    };
    sgcForLiquidity?: string;
    createdAt: string;
    updatedAt: string;
}

// API Functions
export const listMyTokens = (): Promise<{ items: TokenLaunch[] }> =>
  api.get("/tokens/my-tokens").then(r => r.data);

export const createToken = (payload: CreateTokenPayload): Promise<TokenLaunch> =>
  api.post("/tokens", payload).then(r => r.data);

export const updateToken = (id: string, payload: Partial<CreateTokenPayload>): Promise<TokenLaunch> =>
  api.put(`/tokens/${id}`, payload).then(r => r.data);

export const getTokenDetails = (id: string): Promise<TokenLaunch> =>
  api.get(`/tokens/${id}`).then(r => r.data);

export const deployToken = (id: string): Promise<TokenLaunch> =>
  api.post(`/tokens/${id}/submit`, {}).then(r => r.data);
