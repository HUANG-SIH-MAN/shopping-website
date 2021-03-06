const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const auth = require('./modules/auth')
const user = require('./modules/user')
const commodity = require('./modules/commodity')
const admin = require('./modules/admin')
const cart = require('./modules/cart')
const order = require('./modules/order')
const userAPI = require('./modules/api/user')
const commodityAPI = require('./modules/api/commodity')
const cartAPI = require('./modules/api/cart')
const orderAPI = require('./modules/api/order')
const adminAPI = require('./modules/api/admin')
const { authenticator, authenticatedAdmin } = require('../middleware/auth')
const { authenticatedAPI, authenticatedAdminAPI } = require('../middleware/api-auth')

// API路由
router.use('/api/admin', authenticatedAdminAPI, adminAPI)
router.use('/api/cart', authenticatedAPI, cartAPI)
router.use('/api/order', authenticatedAPI, orderAPI)
router.use('/api/commodities', commodityAPI)
router.use('/api/users', userAPI)

// 一般畫面路由
router.use('/auth', auth)
router.use('/users', user)
router.use('/admin', authenticatedAdmin, admin)
router.use('/commodity', authenticator, commodity)
router.use('/cart', authenticator, cart)
router.use('/order', order)
router.use('/', authenticator, home)

module.exports = router