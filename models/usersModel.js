const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userRole:
  {
    type: String,
    // default: 'Admin',
    enum: ['Admin', 'superAdmin','iSuperAdmin'],
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  newPassword: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  individualProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessProfile",
    required: false,
    default: null,
  },
  organizationProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessProfile",
    required: false,
    default: null,
  },
  subscription: {
    isActive: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  planeName: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    // default: "Basic",
    required: true,
  },
  maxInvoices: {
    type: Number,
    default: 3,
    required: true,

  },
  maxClients: {
    type: Number,
    default: 3,
    required: true,

  },
  price: {
    type: Number,
    default: 0,
    required: true,
  },
});

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
