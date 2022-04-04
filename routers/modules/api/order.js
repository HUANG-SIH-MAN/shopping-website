const express = require('express')
const router = express.Router()
const orderController = require('../../../controller/api/orderController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { paramsChecker } = require('../../../middleware/check-params')

router.put('/createOrder', orderController.createOrder)
router.put('/updateOrder/:id', paramsChecker, orderController.updateOrder)
router.put('/failOrder/:id', paramsChecker, orderController.failOrder)
router.use('/', apiErrorHandler)

module.exports = router