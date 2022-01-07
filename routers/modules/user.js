const express = require('express')
const router = express.Router()
const userController = require('../../controller/userController')

//註冊、登入、登出
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)

module.exports = router