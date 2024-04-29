const errorMiddleware = require("../middleware/error");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { userModel } = require("../models/usersModel");

const getPlanData = async (req, res, next) => {
  try {
    const data = await userModel.find();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    error.statusCode = 400;
    return errorMiddleware(error, req, res, next);
  }
};

const addPlanData = async (req, res, next) => {
  try {
    const {
      planName,
      maxInvoices,
      maxClients,
      amount,
      userRole,
      startDate,
      endDate,
    } = req.body;

    const data = await userModel.create({
      planName,
      maxInvoices,
      maxClients,
      amount,
      userRole,
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      message: "plan has created successfully",
      data: data,
    });
  } catch (error) {
    error.statusCode = 400;
    return errorMiddleware(error, req, res, next);
  }
};

const choosePlan = async (req, res) => {
  try {
    const { userId, planName, maxInvoice, maxClient, amount } = req.body;

    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
      user.subscription.isActive = false;

    if (planName === "Premium") {
      user.planName = planName;
      user.maxInvoices = -1;
      user.maxClients = -1;
      user.amount = 500;
    //   user.userRole = "iSuperAdmin";
    } else if (planName === "Standard") {
      user.planName = planName;
      user.maxInvoices = 300;
      user.maxClients = 300;
      user.amount = 100;
      user.userRole = "superAdmin";
    } else if (planName === "Basic") {
      user.planName = planName;
      user.maxInvoices = 100;
      user.maxClients = 100;
      user.amount = 50;
    //   user.userRole = "Admin";
    } else if (planName === "Free") {
      user.planName = planName;
      user.maxInvoices = 3;
      user.maxClients = 3;
      user.amount = 0;
      user.userRole = "User";
      user.subscription.isActive = true;
      user.subscription.startDate = new Date();
      user.subscription.endDate = new Date(user.subscription.startDate);
      user.subscription.endDate.setMonth(
        user.subscription.endDate.getMonth() + 1);
    }

    user = await user.save();

    res.status(200).json({ message: "Plan chosen successfully", user });
  } catch (error) {
    console.error("Error choosing plan:", error);
    res.status(500).json({ error: "Failed to choose plan" });
  }
};

const planPayment = async (req, res, next) => {
  const { amount, userId, payment_method } = req.body;
  const amountInCents = amount * 100;
  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let planPrice;
    if (user.planName === "Premium") {
      planPrice = 500;
    } else if (user.planName === "Standard") {
      planPrice = 300;
    } else if (user.planName === "Basic") {
      planPrice = 50;
    } else if (user.planName === "Free") {
      planPrice = 0;
    }
    if (amount < planPrice) {
      return res
        .status(400)
        .json({ error: `Payment amount must be at least $${planPrice}` });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "USD",
      payment_method,
      confirm: true,
      description: "Payment for subscription",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (paymentIntent.status === "succeeded") {
      user.subscription.isActive = true;
      user.subscription.startDate = new Date();
      user.subscription.endDate = new Date(user.subscription.startDate);

      // Adjust subscription end date based on plan
      if (user.planName === "Premium") {
        user.userRole = "iSuperAdmin";
        user.subscription.endDate.setMonth(
          user.subscription.endDate.getMonth() + 1
        );
      } else if (user.planName === "Standard") {
        user.userRole = "superAdmin";
        user.subscription.endDate.setMonth(
          user.subscription.endDate.getMonth() + 6
        );
      } else if (user.planName === "Basic") {
        user.userRole = "Admin";
        user.subscription.endDate.setMonth(
          user.subscription.endDate.getMonth() + 3
        );
      } else if (user.planName === "Free") {
        // user.userRole = "User";
        user.subscription.endDate.setMonth(
          user.subscription.endDate.getMonth() + 1
        );
      }

      user = await user.save();

      return res.json({
        success: true,
        message: "Payment successful. Subscription activated",
        user,
      });
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
};


module.exports = { getPlanData, addPlanData, choosePlan, planPayment };
