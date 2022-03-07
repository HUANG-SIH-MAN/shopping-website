const express = require('express')
const router = express.Router()
const commodityController = require('../../../controller/api/commodityController')

router.get('/', commodityController.getCommodities)

module.exports = router