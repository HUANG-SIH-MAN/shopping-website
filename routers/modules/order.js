const express = require('express')
const router = express.Router()
const orderController = require('../../controller/orderController')
const { authenticator } = require('../../middleware/auth')

router.get('/information', authenticator, orderController.orderInformation)
router.post('/confirmInformation', authenticator, orderController.confirmInformation)
router.post('/mpgateway/callback', orderController.mpgatewayCallback)
router.get('/records', authenticator, orderController.orderRecords)

module.exports = router