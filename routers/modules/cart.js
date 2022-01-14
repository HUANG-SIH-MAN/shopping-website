const express = require('express')
const router = express.Router()
const cartController = require('../../controller/cartController')

router.get('/', cartController.cartListPage)
router.put('/addQuantity/:id', cartController.addQuantity)
router.put('/reduceQuantity/:id', cartController.reduceQuantity)
router.post('/:commodityId', cartController.addCommodity)
router.delete('/:id', cartController.removeCommodity)

module.exports = router