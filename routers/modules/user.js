const express = require('express')
const router = express.Router()
const passport = require('passport') 
const userController = require('../../controller/userController')

//註冊、登入、登出
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)
router.post('/login',passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}) ,userController.login)
router.get('/logout', userController.logout)

module.exports = router