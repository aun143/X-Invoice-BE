const express = require("express");
const emailRouter = require("./emailRouter");
const clientRouter = require("./clientRouter");
const usersRouter = require("./userRouter");
const businessRouter = require("./businessRouter ");
const invoiceRouter = require("./invoiceRouter");
const pdfRouter = require("./pdfRouter");
const planRouter = require("./planRouter");
const uploadRouter = require("./uploadRouter");

const router = express.Router();

router.use("/user", usersRouter.usersRouter);
router.use("/business", businessRouter.businessRouter);
router.use("/client", clientRouter.clientRouter);
router.use("/invoice", invoiceRouter.invoiceRouter);
router.use("/upload", uploadRouter.uploadRouter);
router.use("/email", emailRouter.emailRouter);
router.use("/pdf", pdfRouter.pdfRouter);
router.use("/plan" ,planRouter.planRouter);

module.exports = { router: router };
