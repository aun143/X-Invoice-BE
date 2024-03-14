const express = require("express");
const router = express.Router();

const {
  createBusinessProfile,
  getAllBusinessProfile,
  deleteBusinessProfile,
  updateBusinessProfile,
  getBusinessProfileById,
} = require("../controllers/businessController");

const { protectRoutes } = require("../middleware/authMiddleware");
router.use(protectRoutes);

router.post("/postbusinessProfile", createBusinessProfile);
router.get("/getallbusinessProfile", getAllBusinessProfile);
router.delete("/deletebusinessProfile/:id", deleteBusinessProfile);
router.put("/updatebusinessProfile/:id", updateBusinessProfile);
router.get("/getBusinessProfile/:id", getBusinessProfileById);

module.exports = {
  businessRouter: router,
};
