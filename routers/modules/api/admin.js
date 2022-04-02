const express = require('express')
const router = express.Router()
const adminController = require('../../../controller/api/adminController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { paramsChecker } = require('../../../middleware/check-params')
const upload = require('../../../utils/multerUpload')

router.get('/commodities', adminController.getCommodities)
router.get('/commodity/:id', paramsChecker, adminController.getCommodity)
router.post('/commodity', upload.single('image'), adminController.addCommodity)
router.put('/commodity/:id', paramsChecker, upload.single('image'), adminController.editCommodity)
router.put('/commodity/removed/:id', paramsChecker, adminController.removedCommodity)
router.put('/commodity/undoRemoved/:id', paramsChecker, adminController.undoRemovedCommodity)
router.delete('/commodity/:id', paramsChecker, adminController.deleteCommodity)
router.get('/removedCommodities', adminController.getRemovedCommodities)
router.get('/category/:id', paramsChecker,adminController.useCategoryfindCommodity)
router.use('/', apiErrorHandler)

module.exports = router
