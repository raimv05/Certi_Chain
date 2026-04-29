# Blockchain Certificate Verification DApp Implementation Plan

## 1. Discovery and Solution Design
- Confirm institution workflows, issuer roles, certificate schema, and compliance requirements.
- Finalize non-functional requirements: throughput, auditability, retention, and recovery.
- Provision Ethereum Sepolia RPC, Pinata account, MongoDB deployment, and Vercel/Render environments.

## 2. Smart Contract Layer
- Implement `CertificateRegistry` with OpenZeppelin `AccessControl`.
- Restrict issuance and revocation to `ISSUER_ROLE`.
- Prevent duplicate certificates with both `certificateId` and `documentHash`.
- Emit auditable issuance and revocation events.
- Add Hardhat tests for happy path, duplicate prevention, RBAC, and revocation.

## 3. Backend Service Layer
- Set up Express with security middleware, rate limiting, validation, JWT auth, and MongoDB models.
- Build issuance workflow: validate input, compute SHA-256 hash, upload artifact to IPFS, anchor hash on Sepolia, persist metadata in MongoDB, generate QR.
- Build bulk issuance from CSV with per-row processing and duplicate safeguards.
- Expose verification APIs for ID lookup and uploaded-file hash comparison.

## 4. Frontend Experience
- Create public verification portal for ID, file, and QR-based validation.
- Create admin console for login, wallet connection, issuance, bulk uploads, analytics, and revocation.
- Integrate with backend REST APIs using Axios and secure token storage.
- Keep UI responsive and deployment-ready for Vite + Vercel.

## 5. Security and Operations
- Store all secrets in environment variables.
- Enforce role-based access control on all protected APIs and contract functions.
- Add request validation, upload limits, and duplicate checks.
- Log blockchain transaction hashes for auditability.

## 6. Testing and Release
- Run Hardhat unit tests against the contract.
- Add API integration tests for auth, issuance, verification, and revocation.
- Validate end-to-end flow: issue -> IPFS upload -> on-chain record -> QR verify -> revoke.
- Deploy contract to Ethereum Sepolia, backend to Render/AWS, and frontend to Vercel.
