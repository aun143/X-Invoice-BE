const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = (password) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await bcrypt.hash(password,12));
    } catch (error) {
      reject(error);
    }
  });

const comparewPassword = (clientPass, dbPass) =>
  bcrypt.compareSync(clientPass, dbPass);

const formateData = (data) => {
  data.dob = new Date(data.dob);
  data.contact = parseInt(data.contact);
  return data;
};

const generarteToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
};

module.exports = {
  hashPassword,
  comparewPassword,
  formateData,
  generarteToken,
};
