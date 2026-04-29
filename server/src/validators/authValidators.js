const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 10 }),
  body("role").optional().isIn(["super_admin", "issuer"]),
  body("organizationId").optional().trim(),
  body("walletAddress").trim().notEmpty(),
];

const loginValidator = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

module.exports = { registerValidator, loginValidator };
