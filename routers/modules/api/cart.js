const express = require('express')
const router = express.Router()
const cartController = require('../../../controller/api/cartController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { paramsChecker } = require('../../../middleware/check-params')

router.put('/addQuantity/:id', paramsChecker, cartController.addQuantity)
router.put('/reduceQuantity/:id', paramsChecker, cartController.reduceQuantity)
router.post('/:id', paramsChecker,cartController.addCommodity)
router.delete('/:id', paramsChecker,cartController.removeCommodity)

router.use('/', apiErrorHandler)

module.exports = router