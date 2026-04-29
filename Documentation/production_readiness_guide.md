# CertiChain — Production Readiness & Security Guide

> **Purpose**: This document serves as the definitive reference for taking CertiChain from the current Sepolia testnet deployment to a secure, scalable, production-ready product. It covers blockchain network selection, migration complexity, security hardening, and governance architecture.

---

## Part 1 — Blockchain Network Selection

### The Decision Framework

The ideal mainnet for a certificate registry must satisfy four criteria:

| Criterion | Why It Matters for CertiChain |
|:---|:---|
| **Cost per transaction** | Bulk issuance (100+ certs/day) must remain affordable |
| **Security** | Certificates are legal documents; immutability is non-negotiable |
| **Developer ecosystem** | Solidity compatibility, tooling, auditors |
| **Decentralization** | Avoids single-point-of-failure or censorship risk |

---

### ✅ Recommended: Polygon PoS (Production Mainnet)

**Verdict: Best overall choice for CertiChain in 2025–2026.**

Polygon PoS is an EVM-compatible Layer 2 sidechain anchored to Ethereum. It offers the best balance of cost, security, ecosystem maturity, and institutional trust for a certificate registry product.

| Metric | Value |
|:---|:---|
| **Token** | MATIC / POL |
| **Avg. gas price** | 30–80 Gwei |
| **Est. cost per certificate** | **$0.001 – $0.008 USD** |
| **Block time** | ~2 seconds |
| **TPS** | ~7,000 |
| **EVM Compatible** | ✅ 100% — zero contract changes needed |
| **Etherscan equivalent** | Polygonscan |
| **Institutional trust** | High — used by UNICEF, Mastercard, Adidas |

**Why not Ethereum Mainnet?**
At ~$7–$15 per issuance, bulk operations would cost thousands of dollars. It is not viable for an educational certificate product.

**Why not Arbitrum or Base?**
Both are excellent technically, but Polygon PoS has a larger presence in the *certificate/credential* space specifically, has deeper fiat on-ramp infrastructure in India (your primary market), and has better support from enterprise partners.

---

### Comparison Table — All Major Candidates

| Network | Type | Cost/Cert | Security | EVM Compat | Best For |
|:---|:---|:---|:---|:---|:---|
| **Polygon PoS** ⭐ | L2 Sidechain | $0.001–$0.008 | High | ✅ 100% | Enterprise credential issuance |
| **Arbitrum One** | L2 Rollup | $0.005–$0.02 | Very High | ✅ 100% | DeFi, high-value assets |
| **Base** | L2 Rollup | $0.002–$0.01 | Very High | ✅ 100% | Consumer apps, Coinbase ecosystem |
| **Ethereum** | L1 | $7–$15 | Highest | ✅ | High-value NFTs, DeFi |
| **BNB Chain** | L1 Sidechain | $0.05–$0.2 | Medium | ✅ | Emerging markets, gaming |
| **Solana** | L1 | < $0.001 | High | ❌ | High-volume apps (requires full rewrite) |

---

## Part 2 — Migration Plan: Sepolia → Polygon PoS Mainnet

### Overall Complexity Rating: 🟢 LOW

Because Polygon PoS is 100% EVM-compatible and your smart contract uses standard Solidity 0.8.x with OpenZeppelin, **zero changes are needed to your smart contract code**. The entire migration is a configuration change.

---

### Step-by-Step Migration

#### Phase 1 — Setup (Complexity: Trivial)

**Step 1.1 — Add Polygon PoS to Hardhat**

In `blockchain/hardhat.config.js`, add a new network entry:
```js
polygon: {
  url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
  gasPrice: 50000000000, // 50 Gwei — safe default
}
```

**Step 1.2 — Update `blockchain/.env`**
```env
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=<your-deployer-wallet-private-key>
POLYGONSCAN_API_KEY=<from polygonscan.com/myapikey>
```

**Step 1.3 — Fund the Deployer Wallet**
- Purchase MATIC/POL on any exchange (Coinbase, Binance, WazirX).
- Transfer to your deployer wallet address.
- Required: ~2–5 MATIC for contract deployment + initial operations.

---

#### Phase 2 — Deploy (Complexity: Trivial)

**Step 2.1 — Deploy the contract**
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network polygon
```
This will output a new contract address. Save it.

**Step 2.2 — Verify on Polygonscan** (optional but strongly recommended for credibility)
```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <DEPLOYER_WALLET_ADDRESS>
```

---

#### Phase 3 — Update Server Config (Complexity: Trivial)

Update `server/.env`:
```env
SEPOLIA_RPC_URL=https://polygon-rpc.com          # Rename this key or add a new one
CERTIFICATE_CONTRACT_ADDRESS=<new_polygon_address>
```

No code changes needed in `blockchainService.js` or `contract.js` — they are already network-agnostic.

---

#### Phase 4 — Update Frontend (Complexity: Low)

The Etherscan links in `CertificateTable.jsx` and `VerificationCard.jsx` are hardcoded to `sepolia.etherscan.io`. Update them to:
```
https://polygonscan.com/tx/${txHash}
```

---

#### Phase 5 — DNS, Domain & SSL (Complexity: Medium)

- Register a domain (e.g., `certichain.in` or `certichain.app`).
- Deploy backend on a cloud provider (AWS, GCP, Railway, Render).
- Deploy frontend on Vercel or Netlify.
- Set up a custom domain with HTTPS (SSL via Let's Encrypt — free).
- Configure CORS in `server/src/app.js` to only allow your production domain.

---

#### Migration Timeline Estimate

| Phase | Estimated Time |
|:---|:---|
| Hardhat config + wallet setup | 30 minutes |
| Contract deployment + verification | 15 minutes |
| Server `.env` update + redeploy | 30 minutes |
| Frontend link updates + redeploy | 30 minutes |
| Domain, DNS, SSL setup | 2–4 hours |
| **Total** | **~5 hours** |

---

## Part 3 — Security Audit

### 3.1 Smart Contract Security

#### ✅ Current Strengths
- Uses OpenZeppelin `AccessControl` — industry standard, battle-tested.
- Custom errors (`revert CertificateAlreadyExists()`) — more gas-efficient and harder to spoof than `require` strings.
- Duplicate detection by both `certificateId` and `documentHash` — prevents double-issuance.
- Revocation is permanent and non-reversible on-chain.

#### ⚠️ Vulnerabilities & Fixes Required

| # | Issue | Severity | Fix |
|:---|:---|:---|:---|
| 1 | **No contract pause mechanism** | 🔴 High | Implement OpenZeppelin `Pausable` — allows emergency halt if a vulnerability is discovered |
| 2 | **Single admin key** | 🔴 High | Implement a **multi-sig wallet** (Gnosis Safe) as the `DEFAULT_ADMIN_ROLE` owner instead of a single private key |
| 3 | **No rate limiting on-chain** | 🟡 Medium | Add a per-address issuance cooldown to prevent spam attacks |
| 4 | **No contract upgrade path** | 🟡 Medium | Use OpenZeppelin's `TransparentUpgradeableProxy` pattern to allow bug fixes without losing data |
| 5 | **Event string indexing limit** | 🟢 Low | Indexed `string` parameters are stored as their `keccak256` hash — document this so event query tools understand the limitation |

---

### 3.2 Backend / API Security

#### ✅ Current Strengths
- JWT-based authentication with role-based access.
- Passwords hashed with `bcrypt` (cost factor 12).
- Input validation middleware in place.

#### ⚠️ Critical Issues & Fixes Required

| # | Issue | Severity | Fix |
|:---|:---|:---|:---|
| 1 | **`JWT_SECRET` is a placeholder** (`change_this_to_a_long_random_secret`) | 🔴 **Critical** | Generate a cryptographically secure 256-bit secret: `openssl rand -hex 64` |
| 2 | **Private key stored in `.env` file** | 🔴 **Critical** | Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler) in production — never commit `.env` to Git |
| 3 | **No rate limiting on API routes** | 🔴 High | Install `express-rate-limit` and apply to `/api/auth/login` (max 10 req/15min) and all certificate routes |
| 4 | **No Helmet.js** | 🟡 Medium | Install `helmet` — sets 15+ security HTTP headers (CSP, HSTS, XSS protection) automatically |
| 5 | **CORS set to `CLIENT_URL` only** | 🟡 Medium | Verify the production URL is set correctly; wildcard CORS must never be used |
| 6 | **MongoDB URI contains credentials** | 🟡 Medium | Rotate to a dedicated user with minimum privileges (`readWrite` on the single DB only) — not cluster root |
| 7 | **No request body size limit** | 🟡 Medium | Add `express.json({ limit: '5mb' })` — prevents payload-based DoS attacks |
| 8 | **No file upload type validation** | 🟡 Medium | `upload.js` validates MIME type but not magic bytes — add `file-type` package to verify actual binary headers |
| 9 | **JWT expiry is 12h** | 🟢 Low | Consider adding refresh tokens for a better UX vs. shorter-lived access tokens (1h access + 7d refresh) |
| 10 | **No audit log for admin actions** | 🟢 Low | Log all issuance and revocation events to a dedicated MongoDB collection with timestamp and IP |

---

### 3.3 Frontend Security

| # | Issue | Severity | Fix |
|:---|:---|:---|:---|
| 1 | **No Content Security Policy (CSP)** | 🟡 Medium | Define a strict CSP header to block XSS injection — configure on your hosting platform (Vercel/Netlify) |
| 2 | **Sensitive data in `localStorage`** | 🟡 Medium | JWT and admin details in `localStorage` are accessible by any JS running on the page — for maximum security, use `httpOnly` cookies via the backend instead |
| 3 | **No CSRF protection** | 🟡 Medium | If you switch to cookie-based auth, implement CSRF tokens (`csurf` package on backend) |
| 4 | **No input sanitization on client** | 🟢 Low | All text inputs should sanitize HTML characters before submission to prevent stored XSS |
| 5 | **Etherscan link opens `target="_blank"`** | 🟢 Low | Always pair with `rel="noopener noreferrer"` — this is already in your code; confirm all external links have it |

---

### 3.4 IPFS / Pinata Data Integrity

| # | Issue | Severity | Fix |
|:---|:---|:---|:---|
| 1 | **Pinata is a centralized pinning service** | 🟡 Medium | For production, also pin to a second provider (Filebase, Web3.Storage) as a backup. If Pinata deletes a pin, the IPFS link breaks |
| 2 | **IPFS CID is content-addressed but not encrypted** | 🟡 Medium | Certificate PDF files on IPFS are publicly readable by anyone who knows the CID. If PDFs contain sensitive PII, encrypt before uploading |
| 3 | **No CID verification on download** | 🟢 Low | When displaying the PDF, re-hash the downloaded content and compare against `documentHash` in MongoDB to detect tampering |

---

## Part 4 — Governance Architecture

### 4.1 Who Controls the Contract?

**Current (Unsafe) Setup:**
A single deployer wallet holds `DEFAULT_ADMIN_ROLE`. If this private key is lost or compromised, the entire contract's administrative control is permanently lost.

**Recommended Production Setup: Gnosis Safe Multi-Sig**

A Gnosis Safe is a smart contract wallet that requires M-of-N signatures to execute any transaction. Example: 2-of-3 means 2 out of 3 designated signers must approve any admin action.

```
Contract Admin Role → Gnosis Safe (2-of-3)
                          ├── Founder Wallet
                          ├── CTO Wallet
                          └── Legal/Operations Wallet
```

**Setup steps:**
1. Create a Gnosis Safe at `app.safe.global` on Polygon.
2. Transfer `DEFAULT_ADMIN_ROLE` to the Safe address.
3. All future `authorizeIssuer` / `revokeIssuer` calls require multi-sig approval.

---

### 4.2 Operational Governance Policies

| Policy | Description |
|:---|:---|
| **Issuer Onboarding** | Define a formal process for adding new institutions as `ISSUER_ROLE` holders. Require identity verification (KYC) before granting on-chain issuing rights. |
| **Revocation Policy** | Document legally-binding rules for when revocation is triggered (fraud, clerical error, etc.). |
| **Dispute Resolution** | Provide an off-chain mechanism (email/portal) for certificate holders to dispute a revocation before it is finalized. |
| **Key Rotation** | Rotate the backend `ISSUER_PRIVATE_KEY` at least every 6 months. Schedule calendar reminders. |
| **Upgrade Policy** | Any smart contract upgrade must be reviewed by at least 2 team members and announced 48h in advance. |

---

### 4.3 Emergency Response Plan

| Scenario | Response |
|:---|:---|
| **Private key compromised** | Immediately call `revokeIssuer(compromisedAddress)` from Gnosis Safe. Deploy new issuer wallet. |
| **Smart contract bug found** | If using Upgradeable Proxy — push a fix. If not — deploy new contract, migrate metadata in MongoDB to new address. Call `pause()` on old contract if implemented. |
| **Database breach** | Rotate MongoDB credentials. All cert hashes are on-chain; IPFS files are immutable. Financial damage is limited to PII exposure. |
| **DDoS on API** | Enable Cloudflare proxy (free tier) in front of your domain for automatic DDoS mitigation. |

---

## Part 5 — Full Loophole Checklist

Use this checklist before going live.

### Smart Contract
- [ ] `Pausable` emergency stop implemented
- [ ] Multi-sig wallet (Gnosis Safe) owns `DEFAULT_ADMIN_ROLE`
- [ ] Contract verified on Polygonscan
- [ ] Independent security audit conducted (Certik, OpenZeppelin, Code4rena)
- [ ] Upgradeability pattern implemented (Transparent Proxy)

### Backend
- [ ] `JWT_SECRET` is a cryptographically random 64-byte hex string
- [ ] `ISSUER_PRIVATE_KEY` stored in a secrets manager, not `.env`
- [ ] Rate limiting on all public and auth endpoints
- [ ] `helmet()` middleware installed
- [ ] CORS restricted to production domain only
- [ ] MongoDB user has minimum required privileges
- [ ] File upload magic byte validation
- [ ] Request body size limit configured
- [ ] Admin action audit log implemented
- [ ] HTTPS enforced (HTTP requests rejected)
- [ ] `.env` and `node_modules` in `.gitignore`

### Frontend
- [ ] Content Security Policy header configured
- [ ] All external links use `rel="noopener noreferrer"`
- [ ] No secrets or private keys in frontend code
- [ ] All `console.log` statements removed from production build
- [ ] Etherscan links updated to Polygonscan

### Infrastructure
- [ ] HTTPS with valid SSL certificate
- [ ] Cloudflare or equivalent CDN/WAF in front of domain
- [ ] MongoDB Atlas IP whitelist restricted to server IPs only
- [ ] Automated daily database backups enabled
- [ ] Error monitoring (Sentry) set up for both frontend and backend
- [ ] Uptime monitoring (BetterUptime, UptimeRobot) configured
- [ ] Pinata files backed up to a second pinning service

### Legal & Compliance
- [ ] Privacy Policy published on the website
- [ ] Terms of Service for certificate holders published
- [ ] Issuer agreement (legal contract) signed by each institution using the platform
- [ ] GDPR / IT Act compliance reviewed — especially for PII in PDFs uploaded to IPFS
