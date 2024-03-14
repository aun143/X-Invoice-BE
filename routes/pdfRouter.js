const express = require("express");

const { generatePDF } = require("../controllers/pdfController");
const router = express.Router();

router.get("/X-Invoice", generatePDF);

module.exports = {
  pdfRouter: router,
};

// const express = require('express');
// const multer = require('multer');
// const { generatePDF } = require('../controllers/pdfController');
// const { handleUpload } = require('../helpers/cloudinary.helper');
// // const { handleUpload } = require('../middleware/cloudinaryMiddleware');
// const router = express.Router();
// const upload = multer({ dest: 'uploads/' });

// router.get('/X-Invoice', upload.single('file'), async (req, res, next) => {
//   try {
//     const file = req.file.path;
//     const uploadedFile = await handleUpload(file);
//     req.uploadedFileUrl = uploadedFile.secure_url;
//     next();
//     console.log("file",file)
//   } catch (error) {
//     console.error('File upload error:', error);
//     res.status(500).send("Internal Server Error");
//   }
// }, generatePDF);

// module.exports = { pdfRouter: router };
