const express = require('express')
const router = express.Router()
const adminController = require('../../controller/adminController')

//上傳檔案設定
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//商品CRUD
router.get('/commodities', adminController.commoditiesPage)
router.get('/commodity/create', adminController.createCommodity)
router.post('/commodity', upload.single('image'), adminController.postCommodity)
router.get('/commodity/:id', adminController.commodityPage)
router.get('/commodity/:id/edit', adminController.editCommodity)
router.put('/commodity/:id', upload.single('image'), adminController.putCommodity)

module.exports = router