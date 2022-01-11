const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const auth = require('./modules/auth')
const user = require('./modules/user')
const admin = require('./modules/admin')
const { authenticator, authenticatedAdmin } = require('../middleware/auth')

router.use('/auth', auth)
router.use('/users', user)
router.use('/admin', authenticatedAdmin, admin)
router.use('/', authenticator, home)
module.exports = router