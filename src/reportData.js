// Static research data for the NEAR report. Every figure carries a source and date.
// Live market numbers are fetched in Report.jsx; SNAPSHOT is the fallback if the APIs are unreachable.

export const SNAPSHOT = {
  asOf: "Nov 18, 2026",
  price: 3.2,
  marketCap: 4195443199,
  fdv: 4195443215,
  volume24h: 477954148,
  circulating: 1312035374,
  totalSupply: 1312035379,
  ath: 20.44,
  athDate: "2022-01-16",
  athChangePct: -84.35,
  change7d: -14.58,
  change30d: -34.81,
  change1y: 41.38,
  rank: 22,
  tvl: 155165122,
  fees30d: 102404,
};

export const SOURCES = [
  { name: "CoinGecko (live market data)", url: "https://www.coingecko.com/en/coins/near" },
  { name: "DefiLlama (live TVL and chain fees)", url: "https://defillama.com/chain/near" },
  { name: "Nansen: NEAR Q3 2026 Report", url: "https://nansen.ai/post/near-q3-2026-report" },
  { name: "NEAR Foundation: The State of NEAR Q2 2026", url: "https://www.near.org/blog/the-state-of-near-q-2-2026" },
  { name: "NEAR Protocol: State of NEAR Q3 2026 highlights", url: "https://www.linkedin.com/posts/near-protocol-project_the-state-of-near-q3-2026-activity-7518000542393192448-iMVx" },
  { name: "NEAR docs: Validators and rewards", url: "https://docs.near.org/protocol/network/validators" },
  { name: "NEAR docs: Gas", url: "https://docs.near.org/protocol/transactions/gas" },
  { name: "Bitwise Staking Report Q3 2026", url: "https://bitwiseinvestments.eu/blog/special-reports/the-bitwise-staking-report-q3-2026/" },
  { name: "Live Intents revenue dashboard", url: "https://revenue.near.org" },
];

export const WHAT_IS_NEAR = [
  "NEAR Protocol is a layer-1 blockchain built on sharded proof of stake. It was started in 2017 by Illia Polosukhin (co-author of the Transformer paper) and Alex Skidanov, originally to pay global contributors for AI training data.",
  "Accounts use readable names such as alice.near, with multiple rotatable access keys instead of one raw address.",
  "Today NEAR positions itself as the blockchain for AI: NEAR Intents (cross-chain swaps by stating the outcome you want), Confidential Intents, NEAR AI (private inference) and agent payments.",
];

export const TOKEN_USES = [
  { t: "Gas", d: "Every transaction pays a small fee in NEAR. Fees are burned, not paid to validators." },
  { t: "Staking", d: "Holders delegate NEAR to validators to secure the network and earn rewards. NEAR does not slash staked tokens." },
  { t: "Storage", d: "Accounts must hold NEAR as a deposit to cover the data they store onchain." },
  { t: "AI inference", d: "Since July 30, 2026, staking NEAR generates credits to pay for confidential inference on NEAR AI." },
  { t: "Governance", d: "Stakers take part in protocol decisions, such as the open proposal to cut issuance." },
];

export const TOKENOMICS = [
  ["Genesis supply", "1,000,000,000 NEAR (2020)"],
  ["Annual issuance (current)", "2.5% of total supply, paid as validator rewards"],
  ["Protocol treasury share", "10% of the reward budget"],
  ["Gas fees", "Burned. Until protocol v86 contracts got a 30% rebate; from v87 (nearcore 2.14.0) all gas is burned"],
  ["Staking ratio", "About 45% of supply staked (Bitwise, Q3 2026)"],
  ["Governance proposal", "Reduce issuance from 2.5% to 1.6% per year (under discussion, not yet in force)"],
  ["Fee switch (Feb 2026)", "A share of NEAR Intents swap fees buys back NEAR"],
];

export const Q3 = {
  title: "Q3 2026 (July to September)",
  note: "NEAR is a protocol, not a company, so it publishes no earnings statement. These are the closest equivalents: Intents fees, buyback revenue and onchain usage.",
  rows: [
    ["Intents volume in the quarter", "~$10.4B", "Nansen"],
    ["Cumulative Intents volume", "$32B+ (+45% QoQ)", "NEAR Protocol"],
    ["Cumulative Intents fees", "$52M+", "Nansen"],
    ["Cumulative revenue captured for NEAR buybacks", "$8M+", "Nansen"],
    ["Lifetime fee capture rate", "16.4% (Q2: 11.5%), as of Oct 6", "Nansen"],
    ["Trailing 30-day fee capture", "28.4% (Q2: 30.5%)", "Nansen"],
    ["Confidential Intents TVL", "~$160M (+463% QoQ)", "Nansen"],
    ["near.com volume", "~$2.57B, about a quarter of Intents volume", "Nansen"],
    ["Transactions", "~68.0M (about 739K per day)", "Nansen, NEAR BigQuery"],
    ["Daily active signers", "~79,300 average (range 42.5K to 106.8K)", "Nansen, NEAR BigQuery"],
    ["Bitwise NEAR ETF first-two-day inflows", "$48.7M (launched Sep 29)", "NEAR Protocol"],
    ["NEAR staked for AI inference", "750K+ NEAR", "Nansen"],
  ],
  highlights: [
    "Jul 7: Confidential Intents generally available to all integrators.",
    "Jul 20: v2.13 on mainnet with dynamic resharding and post-quantum (ML-DSA) account signing.",
    "Sep 21: Top Level Accounts and Recovery Keys. Sep 22: tokenized US stocks and ETFs on near.com.",
    "Sep 29: Bitwise NEAR ETF began trading. Late Sep: SHIELD rejected $50M+ of transfers tied to the Bitget hack.",
  ],
};

export const ETF = { nearHeld: 17611017.88, netAssetsUsd: 86969890, asOf: "Oct 18, 2026" };
export const ISSUANCE_PCT = 0.025;
export const CAPTURED_USD = 8_000_000;
