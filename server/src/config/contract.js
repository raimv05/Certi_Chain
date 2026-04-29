const { ethers } = require("ethers");

const abi = [
  // Write functions - signatures unchanged, all params still accepted
  "function issueCertificate(string certificateId, bytes32 documentHash, string ipfsCid, string candidateName, string courseName, string issuerName, uint256 issuedAt) external",
  "function revokeCertificate(string certificateId) external",
  // Read functions - return tuple now omits candidateName, courseName, issuerName (moved to event logs)
  "function getCertificate(string certificateId) external view returns (tuple(string certificateId, bytes32 documentHash, string ipfsCid, uint256 issuedAt, address issuedBy, bool revoked, uint256 revokedAt))",
  "function verifyCertificateById(string certificateId) external view returns (bool isValid, tuple(string certificateId, bytes32 documentHash, string ipfsCid, uint256 issuedAt, address issuedBy, bool revoked, uint256 revokedAt))",
  "function verifyCertificateByHash(bytes32 documentHash) external view returns (bool isValid, tuple(string certificateId, bytes32 documentHash, string ipfsCid, uint256 issuedAt, address issuedBy, bool revoked, uint256 revokedAt))",
  "function getCertificateIdByHash(bytes32 documentHash) external view returns (string)",
  "function certificateExists(string certificateId) external view returns (bool)",
  // Events - all metadata is permanently logged here
  "event CertificateIssued(string indexed certificateId, bytes32 indexed documentHash, address indexed issuedBy, string ipfsCid, string candidateName, string courseName, string issuerName)",
  "event CertificateRevoked(string indexed certificateId, bytes32 indexed documentHash, address indexed revokedBy)"
];

function getContract() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.ISSUER_PRIVATE_KEY;
  const contractAddress = process.env.CERTIFICATE_CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error("Blockchain environment variables are incomplete");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  return new ethers.Contract(contractAddress, abi, signer);
}

module.exports = { getContract, contractAbi: abi };
