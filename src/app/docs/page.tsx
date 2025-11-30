import DocsClientPage from './DocsClientPage';
import { DocsSection } from './DocsClientPage';

// Helper to create a URL-friendly slug from a title
const createSlug = (title: string) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

const docsData: Omit<DocsSection, 'slug'>[] = [
  {
    title: "Blockchain Explorer",
    description: "Allows users to inspect transaction status directly from the blockchain node.",
    endpoints: [
      {
        title: "Get Transaction Details",
        method: "GET",
        path: "/explorer/tx/:hash",
        auth: "Public",
        parameters: [
          { name: "hash", type: "Path", description: "The 66-character transaction hash (e.g., 0x85d...)." }
        ],
        response: `{
  "hash": "0x85d4e0860b5ca201a3488d177b532e6346312165494b5c5bde970b6c52c9c937",
  "from": "0x109621604130f32801CA225D6E8081363f5AA085",
  "to": "0x487aEa14d763b31D1e25C2A2f15ebb91Bfa0C666",
  "value": "120.0",
  "blockNumber": 108832,
  "timestamp": 1764490186,
  "status": "SUCCESS",
  "gasUsed": "21000",
  "gasPrice": "0.000000007"
}`
      }
    ]
  },
  {
    title: "Wallet Management",
    description: "Endpoints for managing user wallets, including balances and sensitive operations.",
    endpoints: [
      {
        title: "Get My Wallet",
        method: "GET",
        path: "/me/wallet",
        auth: "User JWT",
        response: `{
  "sgcBalance": 100.50,
  "fiatBalanceUsd": 500.00,
  "sgcValueUsd": 11557.50,
  "totalAccountValueUsd": 12057.50,
  "isPinSet": true
}`
      },
      {
        title: "Reveal Private Key",
        method: "GET",
        path: "/me/wallet/details",
        auth: "Wallet Access Token",
        description: "A short-lived Wallet Access Token is required for this sensitive operation.",
        response: `{
  "onchainAddress": "0x123...",
  "privateKey": "0xabc..."
}`
      },
      {
        title: "Verify PIN (Unlock Wallet)",
        method: "POST",
        path: "/me/wallet/verify-pin",
        auth: "User JWT",
        body: `{ "pin": "1234" }`,
        response: `{
  "walletAccessToken": "ey...",
  "expiresIn": 14400
}`
      }
    ]
  },
  {
    title: "Token Launchpad",
    description: "Create and deploy your own custom tokens on the SGChain network.",
    endpoints: [
      {
        title: "Create Token Draft",
        method: "POST",
        path: "/tokens",
        auth: "User JWT",
        body: `{
  "tier": "FUN",
  "metadata": {
    "name": "My Coin",
    "symbol": "MYC",
    "decimals": 18
  },
  "supplyConfig": { "totalSupply": "1000000" },
  "allocations": [
    { "category": "CREATOR", "percent": 100, "amount": "1000000" }
  ]
}`
      },
      {
        title: "Submit for Deployment",
        method: "POST",
        path: "/tokens/:id/submit",
        auth: "User JWT",
        description: "Deducts the deployment fee (in SGC) and triggers the on-chain contract creation.",
        response: `{
  "status": "PENDING_ONCHAIN",
  "sgcForLiquidity": "..."
}`
      },
      {
        title: "List My Tokens",
        method: "GET",
        path: "/tokens/my-tokens",
        auth: "User JWT"
      }
    ]
  },
  {
    title: "Swap (DEX)",
    description: "Endpoints for swapping tokens through the decentralized exchange.",
    endpoints: [
      {
        title: "Get Quote",
        method: "GET",
        path: "/swap/quote",
        auth: "User JWT",
        parameters: [
            { name: "tokenIn", type: "Query", description: "'SGC' or a token address." },
            { name: "tokenOut", type: "Query", description: "'SGC' or a token address." },
            { name: "amountIn", type: "Query", description: "The amount of the input token to swap." }
        ],
        response: `{ "amountOut": "12.5432" }`
      },
      {
        title: "Execute Swap",
        method: "POST",
        path: "/swap/execute",
        auth: "Wallet Access Token",
        body: `{
  "tokenIn": "SGC",
  "tokenOut": "0xTokenAddress...",
  "amountIn": "10",
  "slippage": 0.5
}`
      }
    ]
  },
  {
    title: "Transfers",
    description: "Move SGC between users or to external platforms.",
    endpoints: [
        {
            title: "Internal Transfer (SGC)",
            method: "POST",
            path: "/me/transfer/sgc",
            auth: "User JWT",
            body: `{
  "toEmail": "friend@example.com",
  "amountSgc": 5.0
}`
        },
        {
            title: "External Transfer (To Exchange)",
            method: "POST",
            path: "/me/transfer/external",
            auth: "User JWT",
            description: "Returns a redeemable code for use on an external platform.",
            body: `{ "amountSgc": 10 }`
        }
    ]
  }
];

const processedDocs = docsData.map(section => ({
  ...section,
  slug: createSlug(section.title)
}));

export default async function DocsPage() {
  return <DocsClientPage sections={processedDocs} />;
}
