const { ethers } = require("ethers");
const { getContract } = require("../config/contract");

async function issueCertificateOnChain(payload) {
  const contract = getContract();
  const tx = await contract.issueCertificate(
    payload.certificateId,
    `0x${payload.documentHash}`,
    payload.ipfsCid,
    payload.candidateName,
    payload.courseName,
    payload.issuerName,
    payload.issuedAt
  );

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
  };
}

async function revokeCertificateOnChain(certificateId) {
  const contract = getContract();
  const tx = await contract.revokeCertificate(certificateId);
  const receipt = await tx.wait();

  return { txHash: receipt.hash };
}

async function verifyCertificateOnChainById(certificateId) {
  const contract = getContract();
  const [isValid, certificate] = await contract.verifyCertificateById(certificateId);
  return { isValid, certificate };
}

async function verifyCertificateOnChainByHash(documentHash) {
  const contract = getContract();
  const [isValid, certificate] = await contract.verifyCertificateByHash(`0x${documentHash}`);
  return { isValid, certificate };
}

function normalizeAddress(address) {
  return ethers.getAddress(address);
}

module.exports = {
  issueCertificateOnChain,
  revokeCertificateOnChain,
  verifyCertificateOnChainById,
  verifyCertificateOnChainByHash,
  normalizeAddress,
};
