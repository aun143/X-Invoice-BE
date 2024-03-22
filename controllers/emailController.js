const emailModel = require("../models/emailModel");
const { InvoiceDetail } = require("../models/invoiceModel");

const sendEmailFile = async (req, res) => {
  const { to, subject, invoiceId } = req.body;
  try {
    const invoice = await InvoiceDetail.findById(invoiceId);
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
      // pdfUrl: invoice.pdfUrl
    };

    const info = await emailModel.send(to, subject, data);
    if (info) {
      res.status(200).json({ message: "Email Sent Successfully XInvoicely" });
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  } catch (error) {
    console.log("Error sending email", error);
    res.status(500).json({ message: "Error Sending Email XInvoicely", error });
  }
};

module.exports = { sendEmailFile };
