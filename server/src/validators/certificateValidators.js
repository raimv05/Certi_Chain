const { body } = require("express-validator");

const issueCertificateValidator = [
  body("candidateName").trim().notEmpty(),
  body("courseName").trim().notEmpty(),
  body("issuerName").trim().notEmpty(),
  body("issueDate").isISO8601(),
  body("notes").optional().isString(),
];

module.exports = { issueCertificateValidator };
