const express = require('express')
const router = express.Router()
const adminController = require('../../controller/adminController')

//商品CRUD
router.get('/commodities', adminController.commoditiesPage)
router.get('/commodity/:id', adminController.commodityPage)
router.get('/commodity/:id/edit', adminController.editCommodity)

module.exports = router