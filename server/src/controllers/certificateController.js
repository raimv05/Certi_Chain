const { parse } = require("csv-parse/sync");
const { v4: uuidv4 } = require("uuid");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const Certificate = require("../models/Certificate");
const { sha256Buffer } = require("../services/hashService");
const { uploadBufferToIpfs } = require("../services/ipfsService");
const {
  issueCertificateOnChain,
  revokeCertificateOnChain,
  verifyCertificateOnChainById,
  verifyCertificateOnChainByHash,
} = require("../services/blockchainService");
const { generateCertificateQr } = require("../services/qrService");

async function issueCertificate(req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      return next({ statusCode: 400, message: "Certificate file is required" });
    }

    const certificateId = uuidv4();
    
    let finalBuffer = file.buffer;
    
    if (file.mimetype === "application/pdf") {
      try {
        const pdfDoc = await PDFDocument.load(file.buffer);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        const nameText = req.body.candidateName || "Unknown Name";
        const nameWidth = font.widthOfTextAtSize(nameText, 36);
        firstPage.drawText(nameText, {
          x: width / 2 - nameWidth / 2,
          y: height / 2 + 20,
          size: 36,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });

        const courseText = req.body.courseName || "Unknown Course";
        const courseWidth = font.widthOfTextAtSize(courseText, 24);
        firstPage.drawText(courseText, {
          x: width / 2 - courseWidth / 2,
          y: height / 2 - 40,
          size: 24,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });

        const qrCodeDataUrl = await generateCertificateQr(certificateId);
        const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
        const qrImageBytes = Buffer.from(base64Data, "base64");
        const qrImage = await pdfDoc.embedPng(qrImageBytes);

        const qrSize = 80;
        firstPage.drawImage(qrImage, {
          x: width - qrSize - 40,
          y: 40,
          width: qrSize,
          height: qrSize,
        });

        const pdfBytes = await pdfDoc.save();
        finalBuffer = Buffer.from(pdfBytes);
      } catch (err) {
        console.warn("Could not process PDF template, using raw buffer.");
      }
    }

    const documentHash = sha256Buffer(finalBuffer);

    const existing = await Certificate.findOne({
      $or: [{ certificateId }, { documentHash }],
    });
    if (existing) {
      return next({ statusCode: 409, message: "Duplicate certificate detected" });
    }

    const ipfs = await uploadBufferToIpfs(finalBuffer, file.originalname, {
      certificateId,
      candidateName: req.body.candidateName,
    });

    const blockchain = await issueCertificateOnChain({
      certificateId,
      documentHash,
      ipfsCid: ipfs.cid,
      candidateName: req.body.candidateName,
      courseName: req.body.courseName,
      issuerName: req.body.issuerName,
      issuedAt: Math.floor(new Date(req.body.issueDate).getTime() / 1000),
    });

    // QR code is generated above if PDF, but we ensure we have it for the DB
    const qrCodeDataUrl = await generateCertificateQr(certificateId);

    const certificate = await Certificate.create({
      certificateId,
      organizationId: req.user.organizationId,
      candidateName: req.body.candidateName,
      courseName: req.body.courseName,
      issuerName: req.body.issuerName,
      issueDate: req.body.issueDate,
      documentHash,
      ipfsCid: ipfs.cid,
      ipfsUrl: ipfs.url,
      blockchainTxHash: blockchain.txHash,
      qrCodeDataUrl,
      metadata: {
        notes: req.body.notes,
      },
      issuedByAdmin: req.user.sub,
    });

    return res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    return next(error);
  }
}

async function bulkIssueCertificates(req, res, next) {
  try {
    const csvFile = req.files?.csv?.[0];
    const templateFile = req.files?.template?.[0];

    if (!csvFile || !templateFile) {
      return next({ statusCode: 400, message: "Both CSV data and a PDF Template are required" });
    }

    const records = parse(csvFile.buffer.toString("utf8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const summary = [];
    const csvReportRows = ["candidateName,courseName,issuerName,issueDate,certificateId,ipfsUrl,blockchainTxHash,status,reason"];

    for (const record of records) {
      const certificateId = uuidv4();
      
      const pdfDoc = await PDFDocument.load(templateFile.buffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const nameText = record.candidateName || "Unknown Name";
      const nameWidth = font.widthOfTextAtSize(nameText, 36);
      firstPage.drawText(nameText, {
        x: width / 2 - nameWidth / 2,
        y: height / 2 + 20,
        size: 36,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });

      const courseText = record.courseName || "Unknown Course";
      const courseWidth = font.widthOfTextAtSize(courseText, 24);
      firstPage.drawText(courseText, {
        x: width / 2 - courseWidth / 2,
        y: height / 2 - 40,
        size: 24,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });

      const qrCodeDataUrl = await generateCertificateQr(certificateId);
      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const qrImageBytes = Buffer.from(base64Data, "base64");
      const qrImage = await pdfDoc.embedPng(qrImageBytes);

      const qrSize = 80;
      firstPage.drawImage(qrImage, {
        x: width - qrSize - 40,
        y: 40,
        width: qrSize,
        height: qrSize,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = Buffer.from(pdfBytes);
      const documentHash = sha256Buffer(pdfBuffer);

      const duplicate = await Certificate.findOne({
        $or: [{ certificateId }, { documentHash }],
      });

      if (duplicate) {
        summary.push({ candidateName: record.candidateName, status: "skipped", reason: "duplicate" });
        csvReportRows.push(`${record.candidateName},${record.courseName},${record.issuerName},${record.issueDate},,,"duplicate","duplicate"`);
        continue;
      }

      const ipfs = await uploadBufferToIpfs(pdfBuffer, `${certificateId}.pdf`, {
        certificateId,
        candidateName: record.candidateName,
      });

      const blockchain = await issueCertificateOnChain({
        certificateId,
        documentHash,
        ipfsCid: ipfs.cid,
        candidateName: record.candidateName,
        courseName: record.courseName,
        issuerName: record.issuerName,
        issuedAt: Math.floor(new Date(record.issueDate).getTime() / 1000),
      });

      await Certificate.create({
        certificateId,
        organizationId: req.user.organizationId,
        candidateName: record.candidateName,
        courseName: record.courseName,
        issuerName: record.issuerName,
        issueDate: record.issueDate,
        documentHash,
        ipfsCid: ipfs.cid,
        ipfsUrl: ipfs.url,
        blockchainTxHash: blockchain.txHash,
        qrCodeDataUrl,
        issuedByAdmin: req.user.sub,
      });

      summary.push({ candidateName: record.candidateName, status: "issued", certificateId, ipfsUrl: ipfs.url });
      csvReportRows.push(`${record.candidateName},${record.courseName},${record.issuerName},${record.issueDate},${certificateId},${ipfs.url},${blockchain.txHash},"issued",""`);
    }

    return res.status(201).json({ success: true, data: summary, reportCsv: csvReportRows.join("\\n") });
  } catch (error) {
    return next(error);
  }
}

async function listCertificates(req, res, next) {
  try {
    const certificates = await Certificate.find({ organizationId: req.user.organizationId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, data: certificates });
  } catch (error) {
    return next(error);
  }
}

async function revokeCertificate(req, res, next) {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
    if (!certificate) {
      return next({ statusCode: 404, message: "Certificate not found" });
    }

    if (certificate.status === "revoked") {
      return next({ statusCode: 409, message: "Certificate already revoked" });
    }

    const blockchain = await revokeCertificateOnChain(certificate.certificateId);

    certificate.status = "revoked";
    certificate.revokedAt = new Date();
    certificate.blockchainTxHash = blockchain.txHash;
    await certificate.save();

    return res.json({ success: true, data: certificate });
  } catch (error) {
    return next(error);
  }
}

async function verifyByCertificateId(req, res, next) {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId }).lean();
    if (!certificate) {
      return next({ statusCode: 404, message: "Certificate not found" });
    }

    const chain = await verifyCertificateOnChainById(req.params.certificateId);
    return res.json({
      success: true,
      data: {
        ...certificate,
        blockchainValid: chain.isValid,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function verifyByFile(req, res, next) {
  try {
    if (!req.file) {
      return next({ statusCode: 400, message: "Certificate file is required" });
    }

    const documentHash = sha256Buffer(req.file.buffer);
    const certificate = await Certificate.findOne({ documentHash }).lean();
    if (!certificate) {
      return next({ statusCode: 404, message: "Certificate not found for uploaded file" });
    }

    const chain = await verifyCertificateOnChainByHash(documentHash);
    return res.json({
      success: true,
      data: {
        ...certificate,
        blockchainValid: chain.isValid,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  issueCertificate,
  bulkIssueCertificates,
  listCertificates,
  revokeCertificate,
  verifyByCertificateId,
  verifyByFile,
};
