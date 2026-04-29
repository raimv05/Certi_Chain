const router = require("express").Router();

const {
  issueCertificate,
  bulkIssueCertificates,
  listCertificates,
  revokeCertificate,
  verifyByCertificateId,
  verifyByFile,
} = require("../controllers/certificateController");
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");
const validate = require("../middleware/validate");
const { issueCertificateValidator } = require("../validators/certificateValidators");

router.get("/verify/:certificateId", verifyByCertificateId);
router.post("/verify/file", upload.single("file"), verifyByFile);

router.get("/", authenticate, authorize("super_admin", "issuer"), listCertificates);
router.post("/", authenticate, authorize("super_admin", "issuer"), upload.single("file"), issueCertificateValidator, validate, issueCertificate);
router.post("/bulk", authenticate, authorize("super_admin", "issuer"), upload.fields([{ name: "csv", maxCount: 1 }, { name: "template", maxCount: 1 }]), bulkIssueCertificates);
router.patch("/:certificateId/revoke", authenticate, authorize("super_admin", "issuer"), revokeCertificate);

module.exports = router;
