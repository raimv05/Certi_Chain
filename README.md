# CertiChain 🔗

**Blockchain-Powered Certificate Issuance & Verification Platform**

CertiChain is a production-grade decentralized application (DApp) that enables institutions to issue tamper-proof digital certificates anchored on the blockchain. Certificate holders and third parties can independently verify authenticity without trusting a central authority.

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)](https://soliditylang.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?logo=ipfs)](https://pinata.cloud)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎓 **Certificate Issuance** | Issue individual or bulk (CSV) certificates with PDF generation |
| ⛓️ **Blockchain Anchoring** | SHA-256 hash anchored on Ethereum/Polygon via smart contract |
| 📦 **IPFS Storage** | PDF files pinned to IPFS via Pinata for decentralized storage |
| 🔍 **Public Verification** | Verify by Certificate ID, file upload, or QR code scan |
| 🚫 **Revocation** | On-chain revocation with audit trail |
| 🌐 **Etherscan/Polygonscan Links** | Direct link to the blockchain transaction for every certificate |
| 📊 **Admin Dashboard** | Animated analytics, certificate table, bulk operations |
| 🔐 **Role-Based Auth** | JWT-secured admin panel with organization-level access control |

---

## 🏗️ Tech Stack

```
┌─ Frontend ──────────────────────────────────────┐
│  React 18 + Vite + Framer Motion + Lucide Icons  │
│  Recharts · react-router-dom · Axios             │
└──────────────────────────────────────────────────┘
┌─ Backend ───────────────────────────────────────┐
│  Node.js · Express · MongoDB (Mongoose)          │
│  JWT Auth · bcryptjs · Multer · pdf-lib          │
└─────────────────────────────────────────────────┘
┌─ Blockchain ────────────────────────────────────┐
│  Solidity 0.8.24 · Hardhat · OpenZeppelin        │
│  Ethers.js · Ethereum Sepolia / Polygon PoS      │
└─────────────────────────────────────────────────┘
┌─ Storage ───────────────────────────────────────┐
│  IPFS via Pinata · MongoDB Atlas                  │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
CertiChain/
├── blockchain/          # Hardhat project — smart contracts, tests, deployment
│   ├── contracts/       # CertificateRegistry.sol
│   ├── scripts/         # deploy.js, measure-gas.js
│   └── test/            # Mocha/Chai unit tests
├── server/              # Node.js + Express REST API
│   ├── src/
│   │   ├── config/      # Contract ABI, database connection
│   │   ├── controllers/ # Auth, Certificate logic
│   │   ├── middleware/  # JWT auth, file upload, validation
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API route definitions
│   │   └── services/    # Blockchain, IPFS, hashing, QR
│   └── .env.example
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # StatCard, CertificateTable, VerificationCard, etc.
│   │   ├── contexts/    # AuthContext (JWT management)
│   │   ├── pages/       # Dashboard, Verify, Login, Home
│   │   └── services/    # Axios API client
│   └── .env.example
└── docs/                # Architecture and API documentation
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Pinata account (free tier — 1GB)
- MetaMask wallet with Sepolia ETH (from a faucet)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/raimv05/Certi_Chain.git
cd Certi_Chain

cd blockchain && npm install
cd ../server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Fill in MongoDB URI, JWT_SECRET, ISSUER_PRIVATE_KEY, Pinata JWT, etc.

# Blockchain
cp blockchain/.env.example blockchain/.env
# Fill in PRIVATE_KEY and SEPOLIA_RPC_URL

# Client (optional for local)
cp client/.env.example client/.env
```

### 3. Deploy the Smart Contract

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network sepolia
# Copy the deployed address into server/.env → CERTIFICATE_CONTRACT_ADDRESS
```

### 4. Start All Services

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

### 5. Seed the Admin Account

The first admin is seeded from the `SEED_ADMIN_*` values in `server/.env`. Restart the server once to trigger the seed.

Login at: `http://localhost:5173/login`

---

## ⛽ Gas Efficiency

The smart contract is optimized to store only cryptographic references on-chain. Human-readable strings (name, course, issuer) are emitted in immutable event logs — not stored in state variables — reducing gas cost by ~28%.

| Operation | Gas Used |
|---|---|
| Issue Certificate | ~172,208 gas |
| Revoke Certificate | ~35,000 gas |

---

## 🔐 Security Notes

- **Never commit `.env` files** — they are listed in `.gitignore`
- Generate a strong `JWT_SECRET` with: `openssl rand -hex 64`
- For production, use a **Gnosis Safe** multi-sig as the contract admin
- See `docs/` for the full security audit and production readiness guide

---

## 🌐 Deploying to Production (Polygon PoS)

1. Add Polygon network to `blockchain/hardhat.config.js`
2. Run `npx hardhat run scripts/deploy.js --network polygon`
3. Update `CERTIFICATE_CONTRACT_ADDRESS` in `server/.env`
4. Update Etherscan links in frontend to `polygonscan.com`
5. Deploy backend on Railway/Render, frontend on Vercel

Estimated cost per certificate on Polygon: **< $0.01**

---

## 📄 License

MIT — See [LICENSE](LICENSE) for details.

---

*Built with ❤️ by [Manish Rai](https://github.com/raimv05)*
