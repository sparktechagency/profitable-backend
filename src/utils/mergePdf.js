import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import { assetSellerNdaText, brokerNdaText, buyerNdaText, franciseNdaText, ideaListerNdaText, investorNdaText, sellerNdaText } from "./ndaText2.js";


//You can place a signature image at the bottom of the NDA.
async function addSignature(pdfDoc, signaturePath,user) {
  
  //add new page
  //then this add first party and second party in this new page
  const lastPage = pdfDoc.addPage([600, 842])
  const pngImage = await pdfDoc.embedPng(fs.readFileSync(signaturePath));

  const { width, height } = pngImage.scale(0.3);

  //first party
  // const userInfo = `First Party: \nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.phone}\nNID/Passport: ${user.nidPassportNumber}`;
  // ({ lastPage, y } = drawWrappedText(pdfDoc, lastPage, userInfo, 50, 650, font, 12, 500, 14));
  lastPage.drawText("First Party:",{x: 50, y: 650, size: 16});
  lastPage.drawText(`Name: ${user.name}`, { x: 50, y: 620, size: 14});
  lastPage.drawText(`Email: ${user.email}`, { x: 50, y: 595, size: 14});
  lastPage.drawText(`Mobile: ${user.phone}`, { x: 50, y: 570, size: 14});
  lastPage.drawText(`Nid/Passposr: ${user.nidPassportNumber}`, { x: 50, y: 545, size: 14 });

  //second party
  lastPage.drawText("Second Party: ProfitableBusinessForSale.com", {x: 50, y: 460, size: 16, });
  lastPage.drawText("Full Name: Global IPQ LLC (ProfitableBusinessesForSale.com)", {x: 50, y: 430, size: 14, });
  lastPage.drawText("Email: info@ProfitableBusinessesForSale.com", {x: 50, y: 405, size: 14, });
  lastPage.drawText("Signature:", { x: 50, y: 380, size: 14, });
  lastPage.drawImage(pngImage, {x: 50, y: 280, width,height, });
  // Add date & signature label
  lastPage.drawText("Signed on: " + new Date().toLocaleDateString(), {x: 50, y: 255, size: 14, });

  return pdfDoc;
}

function drawWrappedText(pdfDoc, page, text, x, y, font, fontSize, maxWidth, lineHeight) {
  const paragraphs = text.split("\n");
  const pages = pdfDoc.getPages();

  for (const paragraph of paragraphs) {
    let words = paragraph.split(" ");
    let line = "";

    for (let word of words) {
      const testLine = line + word + " ";
      const width = font.widthOfTextAtSize(testLine, fontSize);

      // If text too wide -> write current line & start new one
      if (width > maxWidth) {
        page.drawText(line.trim(), { x, y, size: fontSize, font, color: rgb(0,0,0) });
        line = word + " ";
        y -= lineHeight;

        // If no more space on page → create new page
        if (y < 50) {
          page = pdfDoc.addPage([600, 800]); // A4 portrait
          y = 750;
        }
      } else {
        line = testLine;
      }
    }

    // Draw last line in paragraph
    if (line) {
      page.drawText(line.trim(), { x, y, size: fontSize, font, color: rgb(0,0,0) });
      y -= lineHeight;
    }

    // Extra gap between paragraphs
    y -= lineHeight / 2;

    // If bottom reached → add page
    if (y < 50) {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }
  }

  return { page, y };
}


//We’ll add NDA legal content dynamically into the first page of the PDF along with the user’s info.
async function generateNDAPdf(ndaText) {

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([600, 800]); // A4 portrait
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 750;

  //Title
  page.drawText("Non-Disclosure Agreement (NDA)", {x: 150,y,size: 18,font,color: rgb(0, 0, 0),});
  page.drawText("ProfitableBusinessesForSale.com", {x: 175,y: 725,size: 14,font,color: rgb(0, 0, 0),});
  page.drawText("From Listing to legacy", {x: 210,y: 700,size: 12,font,color: rgb(0, 0, 0),});
  

  y -= 80;

  // Nda legal document
  ({ page, y } = drawWrappedText(pdfDoc, page, ndaText, 50, y, font, 12, 500, 18));
  
  // y -= 20;
  
  // user Info
  // const userInfo = `First Party: \nName: ${user.name}\nEmail: ${user.email}\nMobile: ${user.phone}\nNID/Passport: ${user.nidPassportNumber}`;
  // ({ page, y } = drawWrappedText(pdfDoc, page, userInfo, 50, y, font, 12, 500, 14));

  // Merge Uploaded PDFs (if any)
  // for (const file of uploadedFiles) {
  //   // const existingPdf = await PDFDocument.load(file.buffer);
  //   const existingPdf = await PDFDocument.load(fs.readFileSync(file.path));
  //   const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
  //   copiedPages.forEach((p) => pdfDoc.addPage(p));
  // }

  return pdfDoc;
}

//main function
async function createNDAFile(user,role, files) {
  // replace spaces with underscores
  const safeName = user.name.replace(/\s+/g, "_");

  //select ndaText
  let ndaText;
  switch(role){
    case "Seller":
      ndaText = sellerNdaText;
      break;
    case "Asset Seller":
      ndaText = assetSellerNdaText;
      break;
    case "Buyer":
      ndaText = buyerNdaText;
      break;
    case "Broker":
      ndaText = brokerNdaText;
      break;
    case "Investor":
      ndaText = investorNdaText;
      break;
    case "Business Idea Lister":
      ndaText = ideaListerNdaText;
      break;
    case "Francise Seller":
      ndaText = franciseNdaText;
      break;
    default:
      ndaText = sellerNdaText;
  }
    
  let pdfDoc = await generateNDAPdf(ndaText);
  
  pdfDoc = await addSignature(pdfDoc, "uploads/NDA/bilal_signature.png",user);

  for (const file of files) {
    // const existingPdf = await PDFDocument.load(file.buffer);
    const existingPdf = await PDFDocument.load(fs.readFileSync(file.path));
    const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
    copiedPages.forEach((p) => pdfDoc.addPage(p));
  }

  const finalPdfBytes = await pdfDoc.save();
  const outputPath = `uploads/NDA/nda-${safeName}-${Date.now()}.pdf`;

  fs.writeFileSync(outputPath, finalPdfBytes);

  return outputPath;
}

// async function createNDAFile(user, files) {
//   // Create a new PDF
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage([600, 400]);
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
//   //header
//   page.drawText("Non Disclosure Agreement", {x: 180,y: 360,size: 20,font,color: rgb(0, 0, 0),});
//   page.drawText("ProfitableBusinessesForSale.com", {x: 180,y: 340,size: 16,font,color: rgb(0, 0, 0),});
//   page.drawText("From Listings To Legacy", {x: 220,y: 320,size: 14,font,color: rgb(0, 0, 0),});

//   page.drawText(`${user.nda}`, { x: 50, y: 300, size: 10, font });
// //   page.drawText(`Name: ${user.name}`, { x: 50, y: 280, size: 14, font });
// //   page.drawText(`Email: ${user.email}`, { x: 50, y: 260, size: 14, font });
// //   page.drawText(`Mobile: ${user.phone}`, { x: 50, y: 240, size: 14, font });
// //   page.drawText(`Nid/Passposr: ${user.nidPassportNumber}`, { x: 50, y: 220, size: 14, font });

//   // Merge all uploaded PDFs into this one
//   for (const file of files) {
//     const existingPdf = await PDFDocument.load(fs.readFileSync(file.path));
//     const copiedPages = await pdfDoc.copyPages(existingPdf, existingPdf.getPageIndices());
//     copiedPages.forEach((p) => pdfDoc.addPage(p));
//   }

//   const finalPdfBytes = await pdfDoc.save();

//   // Save or return buffer
//   const outputPath = `uploads/NDA/nda-${user.name}-${Date.now()}.pdf`;
//   fs.writeFileSync(outputPath, finalPdfBytes);

//   return outputPath;
// }


export default createNDAFile;