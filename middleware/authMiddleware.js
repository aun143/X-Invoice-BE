// const jwt = require("jsonwebtoken");
// const { userModel } = require("../models/usersModel");

// const protectRoutes = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (token == null) return res.sendStatus(401); // Unautorized
//     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
//       if (err && err.message == "jwt expired") return res.sendStatus(401);
//       if (err) return res.sendStatus(401);

//       const userExist = await userModel.findOne({ _id: user._id });
//       if (!userExist) return res.sendStatus(401);

//       req.user = userExist;

//       next();
//     });
//   } catch (error) {
//     res.sendStatus(401);
//   }
// };

// module.exports = { protectRoutes };

// const protectRoutes = async (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if (token == null) return res.sendStatus(401); // Unauthorized
//     jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
//       if (err && err.message == "jwt expired") return res.sendStatus(401);
//       if (err) return res.sendStatus(401);

//       const userExist = await userModel.findOne({ _id: user._id });
//       if (!userExist) return res.sendStatus(401);

//       // Check if the user has a subscription
//       if (!userExist.subscription || !userExist.subscription.isActive) {
//         return res.status(403).json({ message: "Subscription is not active. Please subscribe." });
//       }

//       // Check if the user has exceeded any limitations based on their subscription plan
//       if (userExist.subscription.maxInvoices && userExist.invoices.length >= userExist.subscription.maxInvoices) {
//         return res.status(403).json({ message: "You have reached the maximum number of invoices allowed" });
//       }

//       if (userExist.subscription.maxClients && userExist.clients.length >= userExist.subscription.maxClients) {
//         return res.status(403).json({ message: "You have reached the maximum number of clients allowed" });
//       }

//       req.user = userExist;
//       next();
//     });
//   } catch (error) {
//     res.sendStatus(401);
//   }
// };
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/usersModel");

const protectRoutes = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err && err.message == "jwt expired") return res.sendStatus(401);
      if (err) return res.sendStatus(401);

      const userExist = await userModel.findOne({ _id: user._id });
      if (!userExist) return res.sendStatus(401);

      if (!userExist.subscription || !userExist.subscription.isActive) {
        if (userExist.invoices && userExist.invoices.length >= 0) {
          return res.status(403).json({
            message: "You have reached the maximum number of invoices allowed",
          });
        }
        if (userExist.clients && userExist.clients.length >= 0) {
          return res.status(403).json({
            message: "You have reached the maximum number of clients allowed",
          });
        }
      } else {
        const maxInvoicesAllowed = userExist.subscription.maxInvoices || 0;
        const maxClientsAllowed = userExist.subscription.maxClients || 0;

        if (
          userExist.invoices &&
          userExist.invoices.length >= maxInvoicesAllowed
        ) {
          return res.status(403).json({
            message: "You have reached the maximum number of invoices allowed",
          });
        }

        if (
          userExist.clients &&
          userExist.clients.length >= maxClientsAllowed
        ) {
          return res.status(403).json({
            message: "You have reached the maximum number of clients allowed",
          });
        }
      }

      req.user = userExist;
      next();
    });
  } catch (error) {
    res.sendStatus(401);
  }
};

module.exports = { protectRoutes };
