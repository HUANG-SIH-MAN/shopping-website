const express = require('express')
const router = express.Router()
const commodityController = require('../../../controller/api/commodityController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { paramsChecker } = require('../../../middleware/check-params')
const { authenticated } = require('../../../middleware/api-auth')

router.get('/search', commodityController.searchCommodity)
router.get('/categories', commodityController.getCategories)
router.get('/category/:id', paramsChecker,commodityController.useCategoryfindCommodity)
router.get('/like/:id', authenticated, paramsChecker,commodityController.likeCommodity)
router.get('/unlike/:id', authenticated, paramsChecker,commodityController.unlikeCommodity)
router.get('/', commodityController.getCommodities)
router.get('/:id', paramsChecker,commodityController.getCommodity)
router.use('/', apiErrorHandler)

module.exports = router