const express = require('express')
const router = express.Router()
const userController = require('../../../controller/api/userController')
const passport = require('passport')
const { apiErrorHandler } = require('../../../middleware/error-handle')

router.post('/login', passport.authenticate('local', { session: false }), userController.login)
router.use('/', apiErrorHandler)

module.exports = router