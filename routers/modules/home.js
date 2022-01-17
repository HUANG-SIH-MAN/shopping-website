const express = require('express')
const router = express.Router()
const commodityController = require('../../controller/commodityController')

router.get('/search', commodityController.searchCommodity)
router.get('/', commodityController.commoditiesPage)

module.exports = router