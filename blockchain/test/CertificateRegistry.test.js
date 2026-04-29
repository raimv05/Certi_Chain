const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateRegistry", function () {
  async function deployFixture() {
    const [admin, issuer, outsider] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("CertificateRegistry");
    const contract = await Factory.deploy(admin.address);
    await contract.waitForDeployment();

    return { contract, admin, issuer, outsider };
  }

  it("authorizes issuers and issues a certificate", async function () {
    const { contract, admin, issuer } = await deployFixture();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificate-file"));

    await expect(contract.connect(admin).authorizeIssuer(issuer.address))
      .to.emit(contract, "IssuerAuthorized")
      .withArgs(issuer.address);

    await expect(
      contract.connect(issuer).issueCertificate(
        "CERT-001",
        hash,
        "ipfs://cid-1",
        "Asha Patel",
        "Advanced Solidity",
        "Blockchain Academy",
        1713312000
      )
    ).to.emit(contract, "CertificateIssued");

    const [isValid, certificate] = await contract.verifyCertificateById("CERT-001");
    expect(isValid).to.equal(true);
    expect(certificate.ipfsCid).to.equal("ipfs://cid-1");
  });

  it("prevents duplicate issuance by id or hash", async function () {
    const { contract, admin } = await deployFixture();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("same-file"));

    await contract.issueCertificate(
      "CERT-001",
      hash,
      "ipfs://cid-1",
      "Asha Patel",
      "Advanced Solidity",
      "Blockchain Academy",
      1713312000
    );

    await expect(
      contract.issueCertificate(
        "CERT-001",
        ethers.keccak256(ethers.toUtf8Bytes("other-file")),
        "ipfs://cid-2",
        "Ravi Kumar",
        "React for Web3",
        "Blockchain Academy",
        1713312001
      )
    ).to.be.revertedWithCustomError(contract, "CertificateAlreadyExists");

    await expect(
      contract.issueCertificate(
        "CERT-002",
        hash,
        "ipfs://cid-3",
        "Ravi Kumar",
        "React for Web3",
        "Blockchain Academy",
        1713312001
      )
    ).to.be.revertedWithCustomError(contract, "CertificateAlreadyExists");
  });

  it("supports revocation and verification by hash", async function () {
    const { contract } = await deployFixture();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("revokable-file"));

    await contract.issueCertificate(
      "CERT-009",
      hash,
      "ipfs://cid-9",
      "Neha Sharma",
      "Enterprise Blockchain",
      "Blockchain Academy",
      1713312000
    );

    await expect(contract.revokeCertificate("CERT-009"))
      .to.emit(contract, "CertificateRevoked");

    const [isValid, certificate] = await contract.verifyCertificateByHash(hash);
    expect(isValid).to.equal(false);
    expect(certificate.revoked).to.equal(true);
  });

  it("blocks non-issuers from issuing", async function () {
    const { contract, outsider } = await deployFixture();
    const hash = ethers.keccak256(ethers.toUtf8Bytes("unauthorized"));

    await expect(
      contract.connect(outsider).issueCertificate(
        "CERT-010",
        hash,
        "ipfs://cid-10",
        "Unauthorized User",
        "Security",
        "Issuer",
        1713312000
      )
    ).to.be.reverted;
  });
});
