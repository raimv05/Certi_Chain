# Blockchain Token Consumption & Gas Analysis

This report analyzes the token consumption (gas fees) required to generate and issue a digital certificate on the blockchain using the `CertificateRegistry` smart contract.

## ⛽ Gas Consumption Analysis

To determine the exact computational cost of issuing a certificate, we ran a simulation of the `issueCertificate` function on the smart contract.

**Function Profile:** `issueCertificate`
This function is responsible for:
1. Validating that the certificate doesn't already exist (checking state).
2. Storing the certificate metadata mapping (`certificatesById`).
3. Storing the document hash mapping for reverse lookups (`certificateIdByHash`).
4. Emitting the `CertificateIssued` event for indexing.

**Total Gas Used per Issuance:** `~239,317 gas units`

> [!NOTE]
> The primary driver of this gas cost is the `SSTORE` (storage) operations. Storing dynamic strings (like `ipfsCid`, `candidateName`, `courseName`, `issuerName`) on-chain requires more gas than storing fixed-size integers or hashes.

---

## 💰 Approximate Cost in Fiat / Tokens

Gas fees fluctuate based on network congestion (Gas Price in Gwei) and the price of the underlying token (e.g., ETH, MATIC).

Below is the approximate cost to issue **one certificate** across different popular EVM networks based on standard average market conditions:

### 1. Ethereum Sepolia (Current Network)
*   **Token:** Sepolia ETH (sETH)
*   **Token Price:** $0.00 (Testnet token)
*   **Cost per Certificate:** **$0.00 (Free)**
*   *Note: Faucets typically provide 0.5 sETH per day, allowing you to issue ~2,000 certificates daily for free on the testnet.*

### 2. Ethereum Mainnet (Layer 1)
*   **Token:** ETH (Assume $3,000 / ETH)
*   **Avg Gas Price:** 15 Gwei
*   **Calculation:** `239,317 * 15 Gwei = 0.00359 ETH`
*   **Cost per Certificate:** **~$10.77 USD**
*   *Verdict:* Too expensive for bulk certificate issuance.

### 3. Polygon PoS (Layer 2 Sidechain)
*   **Token:** MATIC/POL (Assume $0.70 / POL)
*   **Avg Gas Price:** 50 Gwei
*   **Calculation:** `239,317 * 50 Gwei = 0.0119 POL`
*   **Cost per Certificate:** **~$0.008 USD (Less than a cent)**
*   *Verdict:* Highly recommended for enterprise production.

### 4. Base / Arbitrum (Layer 2 Rollups)
*   **Token:** ETH
*   **Cost per Certificate:** **~$0.005 - $0.02 USD**
*   *Verdict:* Excellent alternatives if you want to remain tightly coupled to Ethereum security while keeping costs near zero.

---

## 📉 Optimization Recommendations for Scale

If you plan to issue thousands of certificates at an enterprise scale, consider the following smart contract optimizations to reduce the `239,317` gas footprint:

> [!TIP]
> **Store Only Hashes On-Chain**
> Currently, the contract stores `candidateName`, `courseName`, and `issuerName` directly on the blockchain. By storing **only** the `documentHash` and the `ipfsCid` on-chain, you can reduce gas consumption by over **50%**. All human-readable data can be fetched directly from the IPFS metadata file when verifying!

> [!TIP]
> **Implement Batch Issuance (Multicall)**
> If you are uploading a CSV with 100 students, your backend currently fires 100 individual transactions. Adding a `bulkIssueCertificates` function to your smart contract that accepts arrays of data will significantly reduce the base transaction overhead (21,000 gas per tx), saving you money on bulk operations.
