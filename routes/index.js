const express= require('express')
const emailRouter = require('./emailRouter')
const clientRouter = require('./clientRouter')
const usersRouter = require('./usersRouter')
const businessRouter = require('./businessRouter ')
const invoiceRouter = require('./invoiceRouter')
const pdfRouter = require('./pdfRouter')
const uploadRouter = require('./uploadRouter')

const router= express.Router()

router.use('/user', usersRouter.usersRouter)
router.use('/business', businessRouter.businessRouter)
router.use('/client', clientRouter.clientRouter)
router.use('/invoice', invoiceRouter.invoiceRouter)
router.use('/upload', uploadRouter.uploadRouter)
router.use('/email', emailRouter.emailRouter)
router.use('/pdf', pdfRouter.pdfRouter)

module.exports= {router: router}
