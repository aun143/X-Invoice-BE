const express = require("express");
const router = express.Router();
const {
  createUser,
  forgotPassword,
  getAllUser,
  deleteUser,
  updateUser,
  LoginUser,
  getProfile,
  updateSubscription,
} = require("../controllers/usersController");
const { protectRoutes } = require("../middleware/authMiddleware");

const errorMiddleware = require("../middleware/error");

router.post("/create", createUser);
// router.put("/subscription", updateSubscription);

router.post("/loginUser", LoginUser);
router.post("/forgotpassword", forgotPassword);

router.use(protectRoutes);
router.get("/me", getProfile);
router.get("/getUser", getAllUser);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
module.exports = {
  usersRouter: router,
};
