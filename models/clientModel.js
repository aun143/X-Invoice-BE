const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  clientType: {
    type: String,
    enum: ["individual", "organization"],
    required: false,
  },
  organizationName: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  faxNumber: {
    type: String,
    required: false,
  },
  taxId: {
    type: Number,
    required: false,
  },
  address1: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  address2: {
    type: String,
    required: false,
  },
  websiteURL: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  postalCode: {
    type: Number,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClientDetail = mongoose.model("ClienteDetail", ClientSchema);

module.exports = { ClientDetail };
