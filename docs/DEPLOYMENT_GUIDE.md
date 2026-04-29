# Deployment Guide

## Smart Contract on Ethereum Sepolia
1. Copy `blockchain/.env.example` to `blockchain/.env`.
2. Set `PRIVATE_KEY`, `SEPOLIA_RPC_URL`, and `ETHERSCAN_API_KEY`.
3. Install dependencies with `npm install`.
4. Run `npm run deploy:sepolia`.
5. Copy the deployed contract address into `server/.env` as `CERTIFICATE_CONTRACT_ADDRESS`.

## Backend on Render or AWS
1. Copy `server/.env.example` to `server/.env`.
2. Set MongoDB Atlas, JWT, Sepolia RPC, issuer private key, Pinata JWT, and public verification URL.
3. Install dependencies with `npm install`.
4. Start with `npm start` or deploy using the platform's Node service.
5. Restrict `CLIENT_URL` to the production frontend domain.

## Frontend on Vercel
1. Copy `client/.env.example` to `client/.env`.
2. Set `VITE_API_URL` to the deployed backend URL.
3. Install dependencies with `npm install`.
4. Build with `npm run build`.
5. Deploy the `client/` directory to Vercel.

## Post-Deployment Validation
1. Seed an admin with `node ../scripts/seed-admin.js` from the `server/` directory or run it from the repo root with Node.
2. Login through `/admin/login`.
3. Issue a certificate and confirm:
   - File is pinned to IPFS
   - Hash is written on Sepolia
   - Record is stored in MongoDB
   - QR link resolves to `/verify?certificateId=...`
4. Revoke the certificate and re-check public verification.
