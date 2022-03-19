const express = require('express')
const router = express.Router()
const orderController = require('../../../controller/api/orderController')
const { apiErrorHandler } = require('../../../middleware/error-handle')

router.put('/updateOrder/:id', orderController.updateOrder)
router.use('/', apiErrorHandler)

module.exports = router