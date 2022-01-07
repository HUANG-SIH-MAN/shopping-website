const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const auth = require('./modules/auth')
const user = require('./modules/user')
const { authenticator } = require('../middleware/auth')
const req = require('express/lib/request')

router.use('/auth', auth)
router.use('/users', user)
router.use('/', authenticator, home)
module.exports = router