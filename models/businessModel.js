const mongoose = require("mongoose");

const BusinessProfileSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  file: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: true,
  },
  websiteURL: {
    type: String,
    required: false,
  },
  taxId: {
    type: Number,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  faxNumber: {
    type: Number,
    required: false,
  },
  customFields: [
    {
      customFieldName: {
        type: String,
        required: false,
      },
      customFieldValue: {
        type: String,
        required: false,
      },
    },
  ],
  postalCode: {
    type: Number,
    required: false,
  },
  profileType: {
    default: null,
    type: String,
  },
});

const BusinessProfile = mongoose.model(
  "BusinessProfile",
  BusinessProfileSchema
);
module.exports = { BusinessProfile };
