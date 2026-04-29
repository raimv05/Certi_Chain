const { PinataSDK } = require("pinata-web3");

async function uploadBufferToIpfs(fileBuffer, fileName, metadata = {}) {
  const jwt = process.env.PINATA_JWT;
  const gateway = process.env.PINATA_GATEWAY_URL;

  if (!jwt || !gateway) {
    throw new Error("Pinata configuration is missing");
  }

  const pinata = new PinataSDK({
    pinataJwt: jwt,
    pinataGateway: gateway,
  });

  const file = new File([fileBuffer], fileName);
  const result = await pinata.upload.file(file).addMetadata({
    name: fileName,
    keyValues: metadata,
  });

  return {
    cid: result.IpfsHash,
    url: `https://${gateway}/ipfs/${result.IpfsHash}`,
  };
}

module.exports = { uploadBufferToIpfs };
