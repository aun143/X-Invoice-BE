const emailModel = require("../models/emailModel");
const { InvoiceDetail } = require("../models/invoiceModel");

function generateRandomPassword(length) {
  const charset = "0123456987";
  let password = "";
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }
  return password;
}
const sendEmailFile = async (req, res) => {
  
  const { to, subject, invoiceId } = req.body;
  const password = generateRandomPassword(6);
  try {
    const invoice = await InvoiceDetail.findById(invoiceId);
    invoice.viewCount += 1;
    const data = {
      receiver: invoice.receiver,
      description: invoice.description,
      invoiceNumber: invoice.invoiceNumber,
      invoiceName: invoice.invoiceName,
      PurchaseOrderNumber: invoice.purchaseOrderNumber,
      quantity: invoice.quantity,
      amount: invoice.amount,
      paymentStatus: invoice.paymentStatus,
      total: invoice.total,
      invoiceDueDate: invoice.invoiceDueDate,
      invoiceLink: invoice.invoiceLink,
      sender: invoice.sender,
    };
    invoice.pdfPassword = password;
    await invoice.save();

    console.log("invoice.viewCount",invoice.viewCount)

    await emailModel.send(to, subject,invoiceId, data,password);
    res.status(200).json({ message: "Email Sent Successfully XInvoicely" });
  } catch (error) {
    console.log("Error sending email", error);
    res.status(500).json({ message: "Error Sending Email XInvoicely", error });
  }
};

module.exports = { sendEmailFile };
