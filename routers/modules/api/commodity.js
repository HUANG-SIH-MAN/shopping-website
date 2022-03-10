const express = require('express')
const router = express.Router()
const commodityController = require('../../../controller/api/commodityController')
const { apiErrorHandler } = require('../../../middleware/error-handle')

router.get('/search', commodityController.searchCommodity)
router.get('/categories', commodityController.getCategories)
router.get('/category/:id', commodityController.useCategoryfindCommodity)
router.get('/', commodityController.getCommodities)
router.get('/:id', commodityController.getCommodity)
router.use('/', apiErrorHandler)

module.exports = router