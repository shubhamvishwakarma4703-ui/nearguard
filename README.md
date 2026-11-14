# NearGuard

**An AI spending firewall for autonomous agent wallets on NEAR.**

Track: **AI Security & Defense**

## The problem
AI agents are starting to hold wallets and pay for services on their own. One scam memo or one runaway loop can drain the wallet.

## What NearGuard does
NearGuard sits between an AI agent and its wallet. Every payment request goes through a policy engine before any money moves:

- **Allowlist check:** is the recipient a known, approved account?
- **Scam detection:** does the memo look like a scam ("URGENT claim airdrop")?
- **Spending limit:** would this break the daily budget?

Each request gets a risk score (0-100) and a verdict: **APPROVED** or **BLOCKED**.

## How to run it
1. `git clone` this repo, then `cd nearguard`
2. `npm install`
3. `npm run dev`
4. Open http://localhost:5173

## How to try it (do X, see Y)
- **Do:** open the app. **See:** a dashboard with three AI agents (ResearchBot, TradeBot, SwarmBot) sending payment requests every few seconds.
- **Do:** watch a request to `fr33-n3ar-g1ft.near` with memo "URGENT claim airdrop". **See:** it is BLOCKED with risk 100 and the reasons listed.
- **Do:** watch approved payments. **See:** the daily budget ring fills toward 10 NEAR.
- **Do:** wait for a request that would pass the limit. **See:** it is BLOCKED with "Daily limit exceeded".
- **Do:** watch the counter under the ring. **See:** "NEAR protected from scams" grows with each blocked request.
- **Do (optional):** connect a funded NEAR **testnet** account in the wallet box and click Connect. **See:** approved payments send real testnet transfers and show a NearBlocks link.

## NEAR technology used
- `near-api-js` (v7): signs and sends real NEAR transfers from the agent wallet on testnet.
- NEAR testnet RPC.

## Current status (honest note)
- The agents and their requests are simulated for the demo.
- The policy engine is real and runs on every request.
- Real on-chain transfers are implemented, but they need a funded testnet account.

## Roadmap
- Policies enforced by a NEAR smart contract and function-call keys
- Per-agent budgets, reputation scores, and human approval for large payments
- Integration with NEAR Intents for cross-chain agent payments

## Built with
React, Vite, framer-motion, near-api-js
