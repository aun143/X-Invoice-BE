const express= require('express')
const emailRouter = require('./emailRouter')
const clientRouter = require('./clientRouter')

const router= express.Router()

router.use('/email-router', emailRouter.emailRouter)
router.use('/client-router', clientRouter.clientRouter)

module.exports= {router: router}
