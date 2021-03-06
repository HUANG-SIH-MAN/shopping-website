const express = require('express')
const router = express.Router()
const adminController = require('../../controller/adminController')
const upload = require('../../utils/multerUpload')

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
//瀏覽類別總表
router.get('/categories', adminController.categoriesPage)
//新增類別
router.get('/category/create', adminController.createCategory)
router.post('/category', adminController.postCategory)
//修改類別
router.get('/category/:id/edit', adminController.editCategory)
router.put('/category/:id', adminController.putCategory)
//瀏覽單一類別
router.get('/category/:id', adminController.categoryPage)
//刪除類別
router.delete('/category/:id', adminController.deleteCategory)

//瀏覽使用者資料
router.get('/users', adminController.usersPage)

module.exports = router