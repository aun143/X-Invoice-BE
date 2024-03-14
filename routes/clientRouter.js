const express = require("express");
const router = express.Router();
const {
  createClient,
  getAllClient,
  deleteClient,
  updateClient,
  getClientById,
} = require("../controllers/clientController");
const { protectRoutes } = require("../middleware/authMiddleware");
router.use(protectRoutes);

router.post("/createClient", createClient);
router.get("/getAllClient", getAllClient);
router.get("/getClient/:id", getClientById);
router.delete("/deleteClient/:id", deleteClient);
router.put("/updateClient/:id", updateClient);

module.exports = {
  clientRouter: router,
};
