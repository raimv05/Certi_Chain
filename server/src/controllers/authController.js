const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const Admin = require("../models/Admin");

async function register(req, res, next) {
  try {
    const { name, email, password, role, walletAddress } = req.body;
    const organizationId = req.body.organizationId || `org-${uuidv4().split('-')[0]}`;

    const exists = await Admin.findOne({ email });
    if (exists) {
      return next({ statusCode: 409, message: "Admin email already exists" });
    }

    const walletExists = await Admin.findOne({ walletAddress });
    if (walletExists) {
      return next({ statusCode: 409, message: "MetaMask wallet is already linked to another account" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const admin = await Admin.create({
      name,
      email,
      passwordHash,
      role,
      organizationId,
      walletAddress,
    });

    return res.status(201).json({ success: true, data: { id: admin.id, email: admin.email } });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return next({ statusCode: 401, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        sub: admin.id,
        role: admin.role,
        email: admin.email,
        organizationId: admin.organizationId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          organizationId: admin.organizationId,
          walletAddress: admin.walletAddress,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
