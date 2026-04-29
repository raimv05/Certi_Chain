const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["super_admin", "issuer"], default: "issuer" },
    walletAddress: { type: String, required: true, unique: true, trim: true },
    organizationId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
