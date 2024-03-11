const cloudinary = require("cloudinary").v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const handleUpload = async (file, folderName) => {
  try {
    const uploadOptions = {
      resource_type: "auto",
      public_id: file.originalname,
      folder: folderName.folderName, // Specify the folder where the image will be stored
    };
    // console.log("folder",folderName.folderName)
    
    const res = await cloudinary.uploader.upload(file, uploadOptions);
    return res;
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};

module.exports = { handleUpload };
