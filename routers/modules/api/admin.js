const express = require('express')
const router = express.Router()
const adminController = require('../../../controller/api/adminController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { paramsChecker } = require('../../../middleware/check-params')

router.get('/commodities', adminController.getCommodities)
router.get('/commodity/:id', paramsChecker, adminController.getCommodity)
router.get('/removedCommodities', adminController.getRemovedCommodities)
router.get('/category/:id', paramsChecker,adminController.useCategoryfindCommodity)
router.use('/', apiErrorHandler)

module.exports = router
