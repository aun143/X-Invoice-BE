const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (to, subject, data, pdfLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlTemplate = fs.readFileSync(
      path.join(__dirname, "../views/invoiceTemplate.hbs"),
      "utf8"
    );
    const compiledTemplate = handlebars.compile(htmlTemplate);
    const htmlContent = compiledTemplate({ ...data, pdfLink }); 
    const mailOptions = {
      from: "inoxent672@gmail.com",
      to: to,
      // subject: subject,
      // html: htmlContent,
    };
    console.log("mailOptions", mailOptions);

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    return info;
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = {
  send: sendEmail,
};
