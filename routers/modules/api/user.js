const express = require('express')
const passport = require('passport')
const router = express.Router()
const userController = require('../../../controller/api/userController')
const { apiErrorHandler } = require('../../../middleware/error-handle')

router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/register', userController.register)
router.use('/', apiErrorHandler)

module.exports = router