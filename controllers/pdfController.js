const puppeteer = require("puppeteer");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { ClientDetail } = require("../models/clientModel");
const { BusinessProfile } = require("../models/businessModel");
const { InvoiceDetail } = require("../models/invoiceModel");

const path = require("path");
const axios = require("axios");
const { log } = require("console");

const fetchData = async (
  clientFilter = {},
  businessFilter = {},
  invoiceFilter = {}
) => {
  try {
    const clientData = await ClientDetail.find(clientFilter);
    const businessData = await BusinessProfile.find(businessFilter);
    const invoiceData = await InvoiceDetail.find(invoiceFilter);


    return { clientData, businessData, invoiceData };
  } catch (error) {
    throw error;
  }
};

const generatePDF = async (req, res) => {
  try {
    const clientIdToGeneratePDF = req.query.clientId;
    const businessIdToGeneratePDF = req.query.businessId;
    const invoiceIdToGeneratePDF = req.query.invoiceId;

    const generatedLink = `?clientId=${clientIdToGeneratePDF}&businessId=${businessIdToGeneratePDF}&invoiceId=${invoiceIdToGeneratePDF}`;

    if (
      !clientIdToGeneratePDF ||
      !businessIdToGeneratePDF ||
      !invoiceIdToGeneratePDF
    ) {
      return res
        .status(400)
        .send(
          "client ID, Business ID, and Invoice ID are required in the query parameters"
        );
    }

    const { clientData, businessData, invoiceData } = await fetchData(
      { _id: clientIdToGeneratePDF },
      { _id: businessIdToGeneratePDF },
      { _id: invoiceIdToGeneratePDF }
    );


    const combinedData = {
      client: clientData,
      business: businessData,
      invoice: invoiceData,
    };
    const browser = await puppeteer.launch();
    const pdfBuffers = [];
    for (const record of combinedData.client) {
      const page = await browser.newPage();
      const htmlPath = path.join(__dirname, "../views/template-pdf.html");
      const content = await page.setContent(
        require("fs").readFileSync(htmlPath, "utf8")
      );
      // await page.evaluate((generatedLink) => {
      //   document.getElementById("generatePdfLink").href = generatedLink;
      // }, generatedLink);


      await page.evaluate(
        (record, combinedData) => {
          document.getElementById("firstNameTo").innerText =
            record.firstName || "";
          document.getElementById("lastNameTo").innerText =
            record.lastName || "";
          document.getElementById("postalCodeTo").innerText =
            record.postalCode || "";
          document.getElementById("countryTo").innerText = record.country || "";
          document.getElementById("cityTo").innerText = record.city || "";
          document.getElementById("address1To").innerText =
            record.address1 || "";

          const businessInfo = combinedData.business;
          const firstBusiness =
            businessInfo && businessInfo.length > 0 ? businessInfo[0] : {};
          document.getElementById("email").innerText =
            firstBusiness.email || "";
          document.getElementById("firstNameFrom").innerText =
            firstBusiness.firstName || "";
          // document.getElementById("organizationNameFrom").innerText =
          // firstBusiness.organizationName || ""; 
          document.getElementById("lastNameFrom").innerText =
            firstBusiness.lastName || "";
          document.getElementById("address1From").innerText =
            firstBusiness.address1 || "";
          document.getElementById("postalCodeFrom").innerText =
            firstBusiness.postalCode || "";
          document.getElementById("cityFrom").innerText =
            firstBusiness.city || "";
          document.getElementById("countryFrom").innerText =
            firstBusiness.country || "";

          const invoiceInfo = combinedData.invoice;
          const firstinvoiceInfo =
            invoiceInfo && invoiceInfo.length > 0 ? invoiceInfo[0] : {};

          document.getElementById("subtotal").innerText =
            firstinvoiceInfo.subtotal || "";
          document.getElementById("total").innerText =
            firstinvoiceInfo.total || "";
          document.getElementById("invoiceNumber").innerText =
            firstinvoiceInfo.invoiceNumber || "";
          document.getElementById("date").innerText =
            firstinvoiceInfo.date || "";
          document.getElementById("description").innerText =
            firstinvoiceInfo.description || "";
          document.getElementById("notes").innerText =
            firstinvoiceInfo.notes || "";
          document.getElementById("purchaseOrderNumber").innerText =
            firstinvoiceInfo.purchaseOrderNumber || "";
          document.getElementById("invoiceDueDate").innerText =
            firstinvoiceInfo.invoiceDueDate || "";

          const itemsContainer = document.getElementById("itemsContainer");

          if (firstinvoiceInfo.items && firstinvoiceInfo.items.length > 0) {
            itemsContainer.innerHTML = "";

            for (const item of firstinvoiceInfo.items) {
              
              const itemContainer = document.createElement("div");
              itemContainer.innerHTML = `
     <div> <p><p> ${item.description || ""}</p></p></div>
     <div  > <p>${item.quantity || ""}</p></div>
     <div> <p>${item.rate || ""}</p></div>
     <div > <p>${item.amount || ""}</p></div> 
    `;
              itemsContainer.appendChild(itemContainer);
            }
          } else {
            itemsContainer.innerHTML = "<p>No items available</p>";
          }
        },
        record,
        combinedData
      );

      const pdf = await page.pdf({ format: "A4" });
      pdfBuffers.push(pdf);
    }

    res.setHeader("Content-Type", "application/pdf");
    pdfBuffers.forEach((pdfBuffer) => res.write(pdfBuffer));
    res.end();
    await browser.close();
  } catch (error) {
    console.error('PDF Generate', error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  generatePDF,
};
