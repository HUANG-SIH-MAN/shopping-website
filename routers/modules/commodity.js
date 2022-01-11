const express = require('express')
const router = express.Router()
const commodityController = require('../../controller/commodityController')

router.get('/:id', commodityController.commodityPage)
router.get('/category/:id', commodityController.useCategoryfindCommodity)

module.exports = router