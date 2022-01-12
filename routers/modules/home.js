const express = require('express')
const router = express.Router()
const commodityController = require('../../controller/commodityController')

router.get('/', commodityController.commoditiesPage)
router.post('/search', commodityController.searchCommodity)

module.exports = router