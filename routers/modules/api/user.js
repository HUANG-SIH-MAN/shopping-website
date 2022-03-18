const express = require('express')
const passport = require('passport')
const router = express.Router()
const userController = require('../../../controller/api/userController')
const { apiErrorHandler } = require('../../../middleware/error-handle')
const { authenticated } = require('../../../middleware/api-auth')

router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/register', userController.register)
router.get('/likeCommodities', authenticated, userController.likeCommodities)
router.get('/cartCommodities', authenticated, userController.cartCommodities)
router.use('/', apiErrorHandler)

module.exports = router