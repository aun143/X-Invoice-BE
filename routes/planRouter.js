const express = require("express");
const router = express.Router();
const {
  getPlanData,
  addPlanData,
  choosePlan,
  planPayment,
} = require("../controllers/planController");
const errorMiddleware = require("../middleware/error");
const { userModel } = require("../models/usersModel");



// const { protectRoutes } = require("../Middleware/authMiddleware");

// router.use(protectRoutes);
router.get("/", getPlanData);
router.post("/addPlan", addPlanData);
router.put("/choosePlan", choosePlan);
router.post("/payment", planPayment);
// router.post("/payment", async (req, res, next) => {
//     const { amount, userId, payment_method } = req.body;
//     const amountInCents = amount * 100;
//     try {
//         let user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         let planPrice;
//         if (user.planName === "Premium") {
//             planPrice = 500;
//         } else if (user.planName === "Standard") {
//             planPrice = 100;
//         } else if (user.planName === "Basic") {
//             planPrice = 50;
//         } else if (user.planName === "Free") {
//             planPrice = 0;
//         }
//         if (amount < planPrice) {
//             return res.status(400).json({ error: `Payment amount must be at least $${planPrice}` });
//         }
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: "USD",
//             payment_method,
//             confirm: true,
//             description: "Payment for subscription",
//             automatic_payment_methods: {
//                 enabled: true,
//                 allow_redirects: 'never'
//             }
//         });

//         if (paymentIntent.status === 'succeeded') {
//             user.subscription.isActive = true;
//             user.subscription.startDate = new Date();
//             user.subscription.endDate = new Date(user.subscription.startDate);

//             // Adjust subscription end date based on plan
//             if (user.planName === "Premium") {
//                 user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 1);
//             } else if (user.planName === "Standard") {
//                 user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 6);
//             } else if (user.planName === "Basic") {
//                 user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 3);
//             } else if (user.planName === "Free") {
//                 user.subscription.endDate.setMonth(user.subscription.endDate.getMonth() + 1);
//             }

//             user = await user.save();

//             return res.json({
//                 success: true,
//                 message: "Payment successful. Subscription activated",
//                 user
//             });
//         } else {
//             return res.status(400).json({ error: "Payment failed" });
//         }
//     } catch(error) {
//         console.error("Error processing payment:", error);
//         res.status(500).json({ error: "Failed to process payment" });
//     }
// });

module.exports = { planRouter: router };
