const express = require('express')
const router = express.Router()
const cartController = require('../../controller/cartController')

router.post('/:commodityId', cartController.addCommodity)

module.exports = router