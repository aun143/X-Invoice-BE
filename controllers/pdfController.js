
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
const date = new Date(invoiceData.date).toLocaleDateString();
    const invoiceDueDate = new Date(invoiceData.invoiceDueDate).toLocaleDateString();

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
  //  const file = {
  //     content: `
  //       <html>
  //         <head>
  //           <title>Your HTML to convert to PDF</title>
  //         </head>
  //         <body>
  //           <h1>Welcome to HTML to PDF conversion!</h1>
  //           <img src="${req.uploadedFileUrl}" alt="Uploaded Image">
  //           <p>This is the content of your PDF.</p>
  //         </body>
  //       </html>
  //     `
  //   };
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
        img {
          margin-left: 10px
          width: 60px; /* Set width to 4 inches */
          height: 60px; /* Set height to 6 inches */
        }
        .container {
          display: flex;
          justify-content: space-between;
        }
        .container img {
          max-width: 100%; /* Ensure the image does not exceed the container width */
          margin-left: 20px; /* Add some space to the left of the image */
        }
      </style>
    </head>
    <body>
    <br/>

      <div style="margin: 40px;">
        <h3>X-INVOICE</h3>
        <br/>
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
            <p><strong>Date: </strong> ${date}<span id="date"></span></p>




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
            <br/>
          </div>
          <div class="section-right">
            <p><strong>Purchase Order Number:</strong>${invoiceData.purchaseOrderNumber} <span id="purchaseOrderNumber"></span></p>
            <p><strong>Invoice Due:</strong>${invoiceDueDate} <span id="invoiceDueDate"></span></p>
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
          <br/>
          <div style="text-align: right">
            <p><span id="subtotal">${invoiceData.subtotal}</span></p>
            <p><span id="total">${invoiceData.total}</span></p>
            <p><span id="total"></span></p>
          </div>
        </div>
        <div>
        <br/>
        <br/>
        <br/>

          <p><strong>Invoice Notes:</strong></p>
          <p><span id="notes"></span>${invoiceData.notes}</p>
        </div>
        <br/>

        <hr />
        <br/>

        <div class="container">
        <div>
          <p><strong>Email:</strong></p>
          <p><span id="email">${businessData.email}</span></p>
          <p><span>Powerd By AccellionX</span></p>
        </div>
   
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
    console.error('PDF Generate', error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  generatePDF,
};














   




// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
// const { ClientDetail } = require("../models/clientModel");
// const { BusinessProfile } = require("../models/businessModel");
// const { InvoiceDetail } = require("../models/invoiceModel");
// const html_to_pdf = require('html-pdf-node');
// const path = require("path");
// const axios = require("axios");
// const { log } = require("console");
// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET
// });

// const fetchData = async (
//   profileIdClient = {},
//   profileIdBusiness = {},
//   invoiceId = {}
// ) => {
//   try {
//     const clientData = await ClientDetail.findById(profileIdClient);
//     const businessData = await BusinessProfile.findById(profileIdBusiness);
//     const invoiceData = await InvoiceDetail.findById(invoiceId);
//     return { clientData, businessData, invoiceData };
//   } catch (error) {
//     throw error;
//   }
// };
// const generatePDF = async (req, res) => {
//   try {
//     const clientIdToGeneratePDF = req.query.clientId;
//     const businessIdToGeneratePDF = req.query.businessId;
//     const invoiceIdToGeneratePDF = req.query.invoiceId;
//     const generatedLink = `?clientId=${clientIdToGeneratePDF}&businessId=${businessIdToGeneratePDF}&invoiceId=${invoiceIdToGeneratePDF}`;

//     if (!clientIdToGeneratePDF || !businessIdToGeneratePDF || !invoiceIdToGeneratePDF) {
//       return res.status(400).send("client ID, Business ID, and Invoice ID are required in the query parameters");
//     }

//     const { clientData, businessData, invoiceData } = await fetchData(
//       { _id: clientIdToGeneratePDF },
//       { _id: businessIdToGeneratePDF },
//       { _id: invoiceIdToGeneratePDF }
//     );
//     const date = new Date(invoiceData.date).toLocaleDateString();
//     const invoiceDueDate = new Date(invoiceData.invoiceDueDate).toLocaleDateString();
//     console.log("clientData>>>>>>>>", clientData);
//     console.log("businessData>>>>>>>>", businessData);
//     console.log("invoiceData>>>>>>>>", invoiceData);

//     let options = { format: 'A4' };

// let file = {
//   content: `<!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>User Information PDF</title>
//     <style>
//     #itemsContainer > div {
//       display: flex;
//       flex-direction: row;
//       max-width:100%;
//       margin-bottom: 2px;  
//     }

//       .section {
//         display: flex;
       
//         flex-direction: row;
//       }
//       .section-left,
//       .section-right {
//         width: 50%;
//       }
   
//       .section-right {
//         text-align: left;
//       }
//       table {
//         width: 100%;
//         display: flex;
//         flex-direction: column;
//       }
   
//       th,
//       td {
//         border: 1px solid #dddddd;
//         text-align: left;
//         padding: 8px;
//       }
//       th {
//         background-color: #f2f2f2;
//         text-align: center;
//       }
//       #paymentStatus {
//         padding: 10px 20px;
//         font-weight: bold;
//         border: 1px solid black;
//         font-size: 12px;
//         border-radius: 5px;
//       }
//       p {
//         margin: 0; /* Remove any margin */
//         padding: 0; /* Remove any padding */
//       }
//       h3
//       {
//         text-align: center;
//         text-decoration: underline;
//       }
//       img {
//         margin-left: 10px
//         width: 60px; /* Set width to 4 inches */
//         height: 60px; /* Set height to 6 inches */
//       }
//       .container {
//         display: flex;
//         justify-content: space-between;
//       }
//       .container img {
//         max-width: 100%; /* Ensure the image does not exceed the container width */
//         margin-left: 20px; /* Add some space to the left of the image */
//       }
//     </style>
//   </head>
//   <body>
//   <br/>

//     <div style="margin: 40px;">
//       <h3>X-INVOICE</h3>
//       <br/>
//       <br/>
//       <p><span id="description"></span></p>
//       <div class="section">
//         <div class="section-left">
//           <p><strong>From:</strong></p>
//           <p>${businessData.firstName}</p>
//           <p>${businessData.lastName}</p>
//           <p>${businessData.address1}</p>
//           <p>${businessData.city}</p>
//           <p>${businessData.country}</p>
//           <p>${businessData.postalCode}</p>
       
//         </div>
//         <div class="section-right">
//           <p><strong>Invoice No: </strong>${invoiceData.invoiceNumber} <span id="invoiceNumber"></span></p>
//           <p><strong>Date: </strong> ${date}<span id="date"></span></p>




//         </div>
//       </div>
//       <br/>
//       <div class="section">
//         <div class="section-left">
//           <p><strong>To: </strong></p>
//           <p>${clientData.firstName}</p>
//           <p>${clientData.lastName}</p>
//           <p>${clientData.address1}</p>
//           <p>${clientData.city}</p>
//           <p>${clientData.country}</p>
//           <p>${clientData.postalCode}</p>
     
//           <br/>
//           <br/>
//         </div>
//         <div class="section-right">
//           <p><strong>Purchase Order Number:</strong>${invoiceData.purchaseOrderNumber} <span id="purchaseOrderNumber"></span></p>
//           <p><strong>Invoice Due:</strong>${invoiceDueDate} <span id="invoiceDueDate"></span></p>
//         </div>
//       </div>
//       <hr />
//       <div style="display: flex; justify-content: space-between;">
//       <div>
//         <strong>Description</strong>
//         ${invoiceData.items.map(item => `<p>${item.description}</p>`).join('')}
//       </div>
//       <div>
//         <strong>Quantity</strong>
//         ${invoiceData.items.map(item => `<p>${item.quantity}</p>`).join('')}
//       </div>
//       <div>
//         <strong>Rate</strong>
//         ${invoiceData.items.map(item => `<p>${item.rate}</p>`).join('')}
//       </div>
//       <div>
//         <strong>Amount</strong>
//         ${invoiceData.items.map(item => `<p>${item.amount}</p>`).join('')}
//       </div>
//     </div>
   
//     <p id="itemsContainer"></p>
//     <hr />
//     <br />
//     <br />
//       <div style="display: flex; justify-content: space-between; margin-left: 200px">
//         <div style="text-align: left">
//           <p><strong>Subtotal:</strong></p>
//           <p><strong>Total:</strong></p>
//           <br/>
//           <p style="text-align: center; background-color: gray; padding: 10px">
//             <strong id="paymentStatus">
//               Balance:
//             </strong>
//           </p>
//         </div>
       
       
//         <br/>
//         <br/>
//         <div style="text-align: right">
//           <p><span id="subtotal">${invoiceData.subtotal}</span></p>
//           <p><span id="total">${invoiceData.total}</span></p>
//           <p><span id="total"></span></p>
//         </div>
//       </div>
//       <div>
//       <br/>
//       <br/>
//       <br/>

//         <p><strong>Invoice Notes:</strong></p>
//         <p><span id="notes"></span>${invoiceData.notes}</p>
//       </div>
//       <br/>

//       <hr />
//       <br/>

//       <div class="container">
//       <div>
//         <p><strong>Email:</strong></p>
//         <p><span id="email">${businessData.email}</span></p>
//         <p><span>Powerd By AccellionX</span></p>
//       </div>
//       <div>
//         <img src="${req.uploadedFileUrl}" alt="Uploaded Image">
//       </div>
//     </div>
//     </div>
//   </body>
//   </html>
//    ` };
    
//     // const file = {
//     //   content: `
//     //     <html>
//     //       <head>
//     //         <title>Your HTML to convert to PDF</title>
//     //       </head>
//     //       <body>
//     //         <h1>Welcome to HTML to PDF conversion!</h1>
//     //         <p>This is the content of your PDF.</p>
//     //       </body>
//     //     </html>
//     //   `
//     // };

//     // Generate PDF using html-pdf-node
//     const pdfBuffer = await html_to_pdf.generatePdf(file, options);
//     console.log("Successfully generated PDF file");

//     // Define the folder and public_id for Cloudinary upload
//     const folder = 'Pdf-X-invoice'; // The folder name in Cloudinary
//     const public_id = `X-invoice-${invoiceData.invoiceNumber}`; // Custom public_id for the PDF

//     // Upload the PDF buffer to Cloudinary with specified folder and public_id
//     const cloudinaryUploadResponse = await cloudinary.uploader.upload_stream(
//       { resource_type: "raw", folder, public_id }, // Set folder and public_id
//       async (error, result) => {
//         if (error) {
//           console.error("Error uploading PDF to Cloudinary:", error);
//           return res.status(500).json({ error: "Failed to upload PDF to Cloudinary" });
//         }

//         try {
//           // Update the corresponding InvoiceDetail with the pdfUrl
//           const updatedInvoice = await InvoiceDetail.findByIdAndUpdate(
//             invoiceIdToGeneratePDF,
//             { $set: { pdfUrl: result.secure_url } },
//             { new: true }
//           );

//           if (!updatedInvoice) {
//             console.error("Invoice not found");
//             return res.status(404).json({ error: "Invoice not found" });
//           }

//           // Sending the PDF URL in the response
//           res.status(200).json({ 
//             public_id: public_id,
//             storageMessage: "Successfully invoice stored as a PDF in Cloudinary",
//             updateMessage: "updatedInvoice is successfully with Pdf Url",
//             pdfUrl: result.secure_url 
//         });
        
//         } catch (updateError) {
//           console.error("Error updating Invoice with pdfUrl:", updateError);
//           res.status(500).json({ error: "Failed to update Invoice with pdfUrl" });
//         }
//       }
//     ).end(pdfBuffer);

//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).json({ error: "Failed to generate PDF" });
//   }
// };

// module.exports = {
//   generatePDF,
// };



//   // <p>${businessData.lastName}</p>
//               // <p>${businessData.firstName}</p> 
//               // <p>${businessData.address1}</p>
//               // <p>${businessData.city}</p>
//               // <p>${businessData.country}</p>
//               // <p>${businessData.postalCode}</p>