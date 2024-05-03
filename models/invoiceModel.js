const mongoose = require("mongoose");

const validStatusValues = ["Draft", "Paid", "Unpaid"];
const InvoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    required: false,
  },
  invoiceDueDate: {
    type: Date,
    required: false,
  },
  purchaseOrderNumber: {
    type: Number,
    required: false,
  },
  invoiceNumber: {
    type: String,
    unique: true,
    required: false,
  },
  detailDescription: {
    type: String,
    required: false,
  },
  quantity: {
    type: Number,
    required: false,
  },
  rate: {
    type: Number,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    default: "Draft",
    enum: validStatusValues,
    required: false,
  },
  receiver: {
    type: Object,
    ref: "ClienteDetail",
    default: null,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  sender: {
    type: Object,
    ref: "BusinessProfile",
    default: null,
    required: false,
  },
  subtotal: {
    type: Number,
    required: false,
  },
  file: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
    required: false,
    default: 0,
  }, 
  blance: {
    type: Number,
    required: false,
    // default: 0,
  },
  url: {
    type: String,
    required: false,
    default: 0,
  },
  date: {
    type: Date,
    required: false,
  },
  invoiceName: {
    type: String,
    required: false,
  },
  pdfUrl: {
    type: String,
    required: false,
  },
  pdfPassword: {
    type: Number,
    required: false,
  }, 
  viewCount: {
    type: Number,
    required: false,
    default: 0
  },  
  downloadCount: {
    type: Number,
    required: false,
    default: 0,
  },
  pdfInvoiceLink:{
    type: String,
    required: false,
  },
  items: [
    {
      description: {
        type: String,
        required: false,
      },
      quantity: {
        type: Number,
        required: false,
      },
      rate: {
        type: Number,
        required: false,
      },
      unit: {
        type: String,
        required: false,
      },
      amount: {
        type: Number,
        required: false,
      },
    },
  ],
});

const InvoiceDetail = mongoose.model("InvoiceDetail", InvoiceSchema);

module.exports = { InvoiceDetail };
