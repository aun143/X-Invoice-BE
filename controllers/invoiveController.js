const { comparewPassword } = require("../helpers/user");
const { BusinessProfile } = require("../models/businessModel");
const { ClientDetail } = require("../models/clientModel");
const { InvoiceDetail } = require("../models/invoiceModel");
const validStatusValues = ["Pending", "Paid", "Unpaid"];

// const createInvoice = async (req, res) => {
//   try {
//     const { receiver, sender } = req.body;

//     const user = req.user._id;
//     req.body.user = user;

//     let client, business;

//     try {
//       client = await ClientDetail.findById(receiver);
//       business = await BusinessProfile.findById(sender);
//     } catch (error) {
//       return res.status(400).send({ message: "Invalid receiver or sender ID format" });
//     }

//     if (!client || !business) {
//       return res.status(404).send({ message: "Client or business not found" });
//     }

//     // Create a new Mongoose Document instance
//     const newInvoice = new InvoiceDetail({
//       ...req.body,
//       receiver: client.toObject(), // Store client object
//       sender: business.toObject(), // Store business object
//     });

//     // Save the document to the database
//     await newInvoice.save();

//     // Exclude 'data' field from 'receiver' and 'sender' when sending the response
//     const { data, ...invoiceWithoutData } = newInvoice.receiver;

//     res.status(200).send({ ...newInvoice.toObject(), receiver: invoiceWithoutData });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message || "Some error occurred while creating the Invoice.",
//     });
//   }
// };

// const createInvoice = async (req, res) => {
//   try {
//     const user = req.user._id;
//     req.body.user = user;

//     const newinvoice = await InvoiceDetail.create(req.body);
//     res.status(200).send(newinvoice);
//     //console.log("Newinvoice", newinvoice);
//   } catch (error) {
//     res.status(500).send({
//       message:
//         error.message || "Some error occurred while creating the Invoice.",
//     });
//   }
// };

const createInvoice = async (req, res) => {
  try {
    const user = req.user;
    const maxInvoicesAllowed = user.subscription.isActive
      ? user.maxInvoices
      : 3;

    const userInvoicesCount = await InvoiceDetail.countDocuments({
      user: user._id,
    });
    if (userInvoicesCount >= maxInvoicesAllowed) {
      return res
        .status(400)
        .json({ message: "Maximum invoices limit reached for the user" });
    }
    if (user.subscription.endDate && user.subscription.endDate < new Date()) {
      return res.status(400).json({
        message: "Your subscription plan has expired. Please update your plan.",
      });
    }
      if(req.body.invoiceName)
      { 
      if (req.body.invoiceName.length < 3 || req.body.invoiceName.length > 20) {
        return res.status(400).json({
          type: "bad",
          message: "Invoice Name must be between 3 and 20 characters",
        });
      }
  
  }
    req.body.user = user._id;
    const newInvoice = await InvoiceDetail.create(req.body);
    res.status(200).send(
     newInvoice,
    );
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Invoice.",
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const { pdfPassword } = req.body;
    const invoice = await InvoiceDetail.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found with this ID",
        invoiceId,
      });
    }

    // if (pdfPassword) {
    //   const isPasswordMatch = await comparewPassword(pdfPassword, invoice.pdfPassword);
    //   if (!isPasswordMatch) {
    //     return res.status(401).json({
    //       message: "Incorrect password provided for this invoice",
    //     });
    //   }
    // }

    console.log("invoice.pdfPassword",invoice.pdfPassword)
    // Formatting the date
    const formattedInvoice = {
      ...invoice.toObject(),
      // Assuming the date field is named 'date', replace it with the actual field name if different
      date: invoice.date.toLocaleDateString("en-CA", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
      invoiceDueDate: invoice.invoiceDueDate.toLocaleDateString("en-CA", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    };
    res.status(200).json(formattedInvoice);
  } catch (error) {
    console.error("Error retrieving Invoice: ", error);
    res.status(500).json({
      message: "Internal server error while retrieving the Invoice.",
    });
  }
};


const getAllInvoice = async (req, res) => {
  try {
    const user = req.user._id;

    const invoices = await InvoiceDetail.find({ user: user });

    // console.log("userId",user)

    res.status(200).send(
      invoices,
    );
    // console.log("Get All InvoiceDetail", invoices);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving Invoice .",
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const deletedinvoice = await InvoiceDetail.findByIdAndDelete(invoiceId);

    if (!deletedinvoice) {
      return res
        .status(404)
        .send({ message: "invoice not found for deletion." });
    }

    return res.status(200).json({
      message: "Successfully deleted record of the InvoiveDetail",
      invoiceId,
    });
    //console.log("Deleted invoice", deletedinvoice);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while deleting the Invoice .",
    });
  }
};

const updatePaidInvoiceStatus = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const updateData = req.body;

    // Check if the provided status is a valid status value
    if (updateData.status && !validStatusValues.includes(updateData.status)) {
      return res.status(400).send({ message: "Invalid status value." });
    }

    const updatedinvoice = await InvoiceDetail.findByIdAndUpdate(
      invoiceId,
      updateData,
      { new: true }
    );

    if (!updatedinvoice) {
      return res.status(404).send({ message: "invoice not found for update." });
    }

    res.status(200).send({
      message: "Invoice Status Upadated successfully",
      updatedinvoice: updatedinvoice,
    });
    //console.log("Updated invoice", updatedinvoice);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the Invoice .",
    });
  }
};

const updateUnpaidInvoiceStatus = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const updateData = req.body;

    // Check if the provided status is a valid status value
    if (updateData.status && !validStatusValues.includes(updateData.status)) {
      return res.status(400).send({ message: "Invalid status value." });
    }

    const updatedinvoice = await InvoiceDetail.findByIdAndUpdate(
      invoiceId,
      updateData,
      { new: true }
    );

    if (!updatedinvoice) {
      return res.status(404).send({ message: "invoice not found for update." });
    }

    res.status(200).send({
      message: "Invoice Status Upadated successfully",
      updatedinvoice: updatedinvoice,
    });
    //console.log("Updated invoice", updatedinvoice);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the Invoice .",
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const updateData = req.body;
    

    const updatedinvoice = await InvoiceDetail.findByIdAndUpdate(
      invoiceId,
      updateData,
      { new: true }
    );
   if(req.body.invoiceName)
      { 
      if (req.body.invoiceName.length < 3 || req.body.invoiceName.length > 20) {
        return res.status(400).json({
          type: "bad",
          message: "Invoice Name must be between 3 and 20 characters",
        });
      }
  
  }
    if (!updatedinvoice) {
      return res.status(404).send({
        message: "invoice not found for update. againt this Id ",
        invoiceId,
      });
    }

    res.status(200).send({
      message: "Invoice updated successfully",
      updatedinvoice: updatedinvoice,
    });
    //console.log("Updated invoice", updatedinvoice);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while updating the Invoice .",
    });
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoice,
  updatePaidInvoiceStatus,
  updateUnpaidInvoiceStatus,
  updateInvoice,
  deleteInvoice,
};
