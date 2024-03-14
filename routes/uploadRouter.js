const express = require("express");
const { imageHandler } = require("../controllers/uploadController");
// const { protectRoutes } = require("../Middleware/authMiddleware");
const router = express.Router();

// router.use(protectRoutes);

router.post("/file", async (req, res) => {
  try {
    const result = await imageHandler(req, res);

    console.log("Cloudinary upload result:", result);

    if (!result || !result.secure_url) {
      console.error("Secure URL is undefined in Cloudinary response:", result);
      return res
        .status(500)
        .json({ success: false, error: "Image upload failed" });
    }

    const { secure_url, public_id } = result;

    res.status(200).json({ success: true, url: secure_url, public_id });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ success: false, error: "Image upload failed" });
  }
});

module.exports = {
  uploadRouter: router,
};
