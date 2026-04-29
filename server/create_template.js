const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");

async function createTemplate() {
  const doc = await PDFDocument.create();
  // Standard A4 landscape: width 841.89, height 595.28
  const page = doc.addPage([841.89, 595.28]);
  const { width, height } = page.getSize();

  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);

  // Draw border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.1, 0.5, 0.8),
    borderWidth: 10,
  });

  // Title
  const title = "CERTIFICATE OF COMPLETION";
  const titleWidth = font.widthOfTextAtSize(title, 48);
  page.drawText(title, {
    x: width / 2 - titleWidth / 2,
    y: height - 120,
    size: 48,
    font,
    color: rgb(0.1, 0.3, 0.5),
  });

  // Subtitle
  const subtitle = "This is to proudly certify that";
  const subtitleWidth = regularFont.widthOfTextAtSize(subtitle, 20);
  page.drawText(subtitle, {
    x: width / 2 - subtitleWidth / 2,
    y: height / 2 + 80,
    size: 20,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Name goes around height / 2 + 20 (drawn by backend)
  
  // Middle text
  const midText = "has successfully completed the course curriculum for";
  const midWidth = regularFont.widthOfTextAtSize(midText, 18);
  page.drawText(midText, {
    x: width / 2 - midWidth / 2,
    y: height / 2 - 10,
    size: 18,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Course goes around height / 2 - 40 (drawn by backend)

  // Footer
  const footerText = "Authorized Issuer: CertiChain Academy";
  const footerWidth = regularFont.widthOfTextAtSize(footerText, 16);
  page.drawText(footerText, {
    x: width / 2 - footerWidth / 2,
    y: 80,
    size: 16,
    font: regularFont,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await doc.save();
  fs.writeFileSync("../template.pdf", pdfBytes);
  console.log("Template generated at ../template.pdf");
}

createTemplate().catch(console.error);
