const express = require('express')
const router = express.Router()
const commodityController = require('../../../controller/api/commodityController')

router.get('/', commodityController.getCommodities)
router.get('/:id', commodityController.getCommodity)

module.exports = router