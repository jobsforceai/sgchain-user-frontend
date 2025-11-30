# Frontend Public Chain Integration Guide

This guide details the API endpoints required to build the public-facing features of the SGChain application. It covers Wallet management, the Blockchain Explorer, Token Launchpad, and Swap functionality.

**Base URL:** `Public Soon` (e.g., `https://api.sgchain.com/api`)
**Authentication:** All endpoints (unless specified) require a standard User JWT in the `Authorization` header: `Bearer <token>`.

---

## 1. Blockchain Explorer (New)

Allows users to inspect transaction status directly from the blockchain node.

### Get Transaction Details
**Endpoint:** `GET /explorer/tx/:hash`
**Auth:** None (Public)

**Parameters:**
- `hash` (Path): The 66-character transaction hash (e.g., `0x85d...`).

**Response (200 OK):**
```json
{
  "hash": "0x85d4e0860b5ca201a3488d177b532e6346312165494b5c5bde970b6c52c9c937",
  "from": "0x109621604130f32801CA225D6E8081363f5AA085",
  "to": "0x487aEa14d763b31D1e25C2A2f15ebb91Bfa0C666",
  "value": "120.0",          // Amount in SGC
  "blockNumber": 108832,     // Null if pending
  "timestamp": 1764490186,   // Unix timestamp
  "status": "SUCCESS",       // PENDING | SUCCESS | FAILED | UNKNOWN
  "gasUsed": "21000",
  "gasPrice": "0.000000007"  // In Gwei
}
```

---

## 2. Wallet Management

### Get My Wallet
**Endpoint:** `GET /me/wallet`
**Description:** Returns current SGC and USD balances, and wallet status.

**Response:**
```json
{
  "sgcBalance": 100.50,
  "fiatBalanceUsd": 500.00,
  "sgcValueUsd": 11557.50,   // SGC * Current Price
  "totalAccountValueUsd": 12057.50,
  "isPinSet": true
}
```

### Reveal Private Key (Sensitive)
**Endpoint:** `GET /me/wallet/details`
**Auth:** Requires **Wallet Access Token** (See "Verify PIN" below).

**Response:**
```json
{
  "onchainAddress": "0x123...",
  "privateKey": "0xabc..." // DO NOT STORE THIS ON CLIENT PERMANENTLY
}
```

### Verify PIN (Unlock Wallet Actions)
**Endpoint:** `POST /me/wallet/verify-pin`
**Body:** `{ "pin": "1234" }` (or Emoji equivalent)

**Response:**
```json
{
  "walletAccessToken": "ey...", // Short-lived token for Swap/Reveal
  "expiresIn": 14400 // Seconds
}
```

---

## 3. Token Launchpad

Allows users to create and deploy their own tokens on SGChain.

### 1. Create Token Draft
**Endpoint:** `POST /tokens`
**Body:**
```json
{
  "tier": "FUN", // or "SUPER"
  "metadata": {
    "name": "My Coin",
    "symbol": "MYC",
    "decimals": 18
  },
  "supplyConfig": {
    "totalSupply": "1000000"
  },
  "allocations": [
    { "category": "CREATOR", "percent": 100, "amount": "1000000" }
  ]
}
```

### 2. Submit for Deployment (Go Live)
**Endpoint:** `POST /tokens/:id/submit`
**Description:** Deducts the deployment fee (in SGC) and triggers the on-chain contract creation.

**Response:**
```json
{
  "status": "PENDING_ONCHAIN", // Poll /my-tokens for "DEPLOYED"
  "sgcForLiquidity": "..."
}
```

### List My Tokens
**Endpoint:** `GET /tokens/my-tokens`

---

## 4. Swap (DEX)

### Get Quote
**Endpoint:** `GET /swap/quote`
**Query Params:** `tokenIn`, `tokenOut`, `amountIn`
- `tokenIn`: 'SGC' or Token Address
- `tokenOut`: 'SGC' or Token Address

**Response:**
```json
{
  "amountOut": "12.5432" // Estimated output
}
```

### Execute Swap
**Endpoint:** `POST /swap/execute`
**Auth:** Requires **Wallet Access Token**.
**Body:**
```json
{
  "tokenIn": "SGC",
  "tokenOut": "0xTokenAddress...",
  "amountIn": "10",
  "slippage": 0.5 // %
}
```

---

## 5. Transfers

### Internal Transfer (SGC)
**Endpoint:** `POST /me/transfer/sgc`
**Body:**
```json
{
  "toEmail": "friend@example.com", 
  // OR "toUserId": "..."
  "amountSgc": 5.0
}
```

### External Transfer (To Exchange)
**Endpoint:** `POST /me/transfer/external`
**Body:** `{ "amountSgc": 10 }`
**Response:** Returns a `code` (e.g., `SGT-XXXX-XXXX`) to be redeemed on the external platform.
