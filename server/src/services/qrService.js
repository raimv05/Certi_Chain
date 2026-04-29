const QRCode = require("qrcode");

async function generateCertificateQr(certificateId) {
  const baseUrl = process.env.PUBLIC_VERIFY_URL || "http://localhost:5173/verify";
  const payload = `${baseUrl}?certificateId=${encodeURIComponent(certificateId)}`;
  return QRCode.toDataURL(payload);
}

module.exports = { generateCertificateQr };
