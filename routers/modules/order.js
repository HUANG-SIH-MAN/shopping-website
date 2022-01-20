const express = require('express')
const router = express.Router()
const orderController = require('../../controller/orderController')

router.get('/information', orderController.orderInformation)
router.post('/confirmInformation', orderController.confirmInformation)
router.post('/mpgateway/callback', orderController.mpgatewayCallback)

module.exports = router