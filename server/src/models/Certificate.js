const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    organizationId: { type: String, required: true, index: true },
    candidateName: { type: String, required: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    issuerName: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    documentHash: { type: String, required: true, unique: true, index: true },
    ipfsCid: { type: String, required: true },
    ipfsUrl: { type: String, required: true },
    blockchainTxHash: { type: String, required: true, index: true },
    blockchainNetwork: { type: String, default: "ethereum-sepolia" },
    blockchainStatus: { type: String, enum: ["pending", "confirmed", "failed"], default: "confirmed" },
    status: { type: String, enum: ["valid", "revoked"], default: "valid" },
    qrCodeDataUrl: { type: String, required: true },
    metadata: { type: Object, default: {} },
    revokedAt: { type: Date, default: null },
    issuedByAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
