const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const CertificateRegistry = await hre.ethers.getContractFactory("CertificateRegistry");
  const registry = await CertificateRegistry.deploy(deployer.address);

  await registry.waitForDeployment();

  console.log("CertificateRegistry deployed to:", await registry.getAddress());
  console.log("Deployer:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
