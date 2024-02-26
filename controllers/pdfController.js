const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { ClientDetail } = require("../models/clientModel");
const { BusinessProfile } = require("../models/businessModel");
const { InvoiceDetail } = require("../models/invoiceModel");
var html_to_pdf = require('html-pdf-node');

const path = require("path");
const axios = require("axios");
const { log } = require("console");
const fetchData = async (
  profileIdClient = {},
  profileIdBusiness = {},
  invoiceId = {}
) => {
  try {
    const clientData = await ClientDetail.findById(profileIdClient);
    const businessData = await BusinessProfile.findById(profileIdBusiness);
    const invoiceData = await InvoiceDetail.findById(invoiceId);
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

    // console.log("clientData>>>>>>>>", clientData);
    // console.log("businessData>>>>>>>>", businessData);
    // console.log("invoiceData>>>>>>>>", invoiceData);



    // let itemsHtml = ''; // Initialize an empty string to hold the HTML for items

    // invoiceData.items.forEach(item => {
    //   itemsHtml += `
    //     <div style="display: flex; justify-content: space-between;">
    //       <p><strong>Description:</strong> ${item.description}</p>
    //       <p><strong>Quantity:</strong> ${item.quantity}</p>
    //       <p><strong>Rate:</strong> ${item.rate}</p>
    //       <p><strong>Amount:</strong> ${item.amount}</p>
    //       </div>
    //       `;
    // });


    let options = { format: 'A4' };
    let file = {
      content: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>User Information PDF</title>
        <style>
        #itemsContainer > div {
          display: flex;
          flex-direction: row;
          max-width:100%;
          margin-bottom: 2px;  
        }
    
          .section {
            display: flex;
           
            flex-direction: row;
          }
          .section-left,
          .section-right {
            width: 50%;
          }
        
          .section-right {
            text-align: left;
          }
          table {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
        
          th,
          td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
            text-align: center;
          }
          #paymentStatus {
            padding: 10px 20px;
            font-weight: bold;
            border: 1px solid black;
            font-size: 12px;
            border-radius: 5px;
          }
          p {
            margin: 0; /* Remove any margin */
            padding: 0; /* Remove any padding */
          }
          h3
          {
            text-align: center;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div style="margin: 40px;">
          <h3>X-INVOICE</h3>
          <br/>
          <p><span id="description"></span></p>
          <div class="section">
            <div class="section-left">
              <p><strong>From:</strong></p>
              <p>${businessData.lastName}</p>
              <p>${businessData.firstName}</p> 
              <p>${businessData.address1}</p>
              <p>${businessData.city}</p>
              <p>${businessData.country}</p>
              <p>${businessData.postalCode}</p>
            
            </div>
            <div class="section-right">
              <p><strong>Invoice No: </strong>${invoiceData.invoiceNumber} <span id="invoiceNumber"></span></p>
              <p><strong>Date: </strong> ${invoiceData.invoiceDueDate}<span id="date"></span></p>

            </div>
          </div>
          <br/>
          <div class="section">
            <div class="section-left">
              <p><strong>To: </strong></p>
              <p>${clientData.firstName}</p>
              <p>${clientData.lastName}</p>
              <p>${clientData.address1}</p>
              <p>${clientData.city}</p>
              <p>${clientData.country}</p>
              <p>${clientData.postalCode}</p>
          
              <br/>
            </div>
            <div class="section-right">
              <p><strong>Purchase Order Number:</strong>${invoiceData.purchaseOrderNumber} <span id="purchaseOrderNumber"></span></p>
              <p><strong>Invoice Due:</strong>${invoiceData.invoiceDueDate} <span id="invoiceDueDate"></span></p>
            </div>
          </div>
          <hr />
          <div style="display: flex; justify-content: space-between;">
          <div>
            <strong>Description</strong>
            ${invoiceData.items.map(item => `<p>${item.description}</p>`).join('')}
          </div>
          <div>
            <strong>Quantity</strong>
            ${invoiceData.items.map(item => `<p>${item.quantity}</p>`).join('')}
          </div>
          <div>
            <strong>Rate</strong>
            ${invoiceData.items.map(item => `<p>${item.rate}</p>`).join('')}
          </div>
          <div>
            <strong>Amount</strong>
            ${invoiceData.items.map(item => `<p>${item.amount}</p>`).join('')}
          </div>
        </div>
        
        <p id="itemsContainer"></p>
        <hr />
        <br />
          <div style="display: flex; justify-content: space-between; margin-left: 200px">
            <div style="text-align: left">
              <p><strong>Subtotal:</strong></p>
              <p><strong>Total:</strong></p>
              <br/>
              <p style="text-align: center; background-color: gray; padding: 10px">
                <strong id="paymentStatus">
                  Balance:
                </strong>
              </p>
            </div>
            
            
            <br/>
            <div style="text-align: right">
              <p><span id="subtotal">${invoiceData.subtotal}</span></p>
              <p><span id="total">${invoiceData.total}</span></p>
              <p><span id="total"></span></p>
            </div>
          </div>
          <div>
          <br/>

            <p><strong>Invoice Notes:</strong></p>
            <p><span id="notes"></span>${invoiceData.notes}</p>
          </div>
          <hr />
          <div style="display: flex">
            <p><strong>Email:</strong></p>
            <p><span id="email">${businessData.email}</span></p>
          </div>
        </div>
      </body>
      </html>
       ` };

    try {
      html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        console.log(" Succeffuly generated PDF file");
        // Sending the PDF in the response
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdfBuffer.length
        });
        res.send(pdfBuffer);
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).send({ error: 'Unable to convert HTML to PDF' });
    }

    // res.sendFile(path.join(__dirname, '../views/output.pdf'));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  generatePDF,
};



