const path = require("path");
const { createRequire } = require("module");

const serverRequire = createRequire(path.join(__dirname, "..", "server", "package.json"));

serverRequire("dotenv").config({ path: path.join(__dirname, "..", "server", ".env") });

const bcrypt = serverRequire("bcryptjs");
const mongoose = serverRequire("mongoose");
const Admin = require("../server/src/models/Admin");

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "certificate_registry",
  });

  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!", 12);

  const admin = await Admin.findOneAndUpdate(
    { email: process.env.SEED_ADMIN_EMAIL || "admin@example.com" },
    {
      name: process.env.SEED_ADMIN_NAME || "Platform Admin",
      email: process.env.SEED_ADMIN_EMAIL || "admin@example.com",
      passwordHash,
      role: "super_admin",
      organizationId: process.env.SEED_ORGANIZATION_ID || "org-001",
      walletAddress: process.env.SEED_ADMIN_WALLET || "",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("Seeded admin:", admin.email);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
