const express = require('express')
const router = express.Router()
const commodityController = require('../../controller/commodityController')

router.get('/:id', commodityController.commodityPage)
router.get('/category/:id', commodityController.useCategoryfindCommodity)
router.post('/like/:commodiytId', commodityController.addLike)
router.delete('/like/:commodiytId', commodityController.removeLike)

module.exports = router