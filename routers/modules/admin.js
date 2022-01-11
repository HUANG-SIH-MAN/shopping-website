const express = require('express')
const router = express.Router()
const adminController = require('../../controller/adminController')

//上傳檔案設定
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//商品CRUD
//商品清單總表
router.get('/commodities', adminController.commoditiesPage)
router.get('/commodities/removed', adminController.removedCommoditiesPage)
//商品上下架
router.put('/commodity/removed/:id', adminController.removedCommodity)
router.put('/commodity/undoRemoved/:id', adminController.undoRemovedCommodity)
//新增商品
router.get('/commodity/create', adminController.createCommodity)
router.post('/commodity', upload.single('image'), adminController.postCommodity)
//瀏覽單一商品
router.get('/commodity/:id', adminController.commodityPage)
//更新商品資訊
router.get('/commodity/:id/edit', adminController.editCommodity)
router.put('/commodity/:id', upload.single('image'), adminController.putCommodity)
//刪除商品
router.delete('/commodity/:id', adminController.deleteCommodity)

//類別CRUD
router.get('/categories', adminController.categoriesPage)
router.get('/category/:id', adminController.categoryPage)

module.exports = router