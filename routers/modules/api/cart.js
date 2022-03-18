const express = require('express')
const router = express.Router()
const cartController = require('../../../controller/api/cartController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { paramsChecker } = require('../../../middleware/check-params')

router.post('/:id', paramsChecker,cartController.addCommodity)

router.use('/', apiErrorHandler)

module.exports = router