const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  planeName: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    required: true,
  },
  maxInvoices: {
    type: Number,
    required: true,
  },
  maxClients: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionSchema);

module.exports = { SubscriptionPlan };
