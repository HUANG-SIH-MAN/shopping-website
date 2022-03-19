const express = require('express')
const router = express.Router()
const passport = require('passport') 
const userController = require('../../controller/userController')
const { authenticator } = require('../../middleware/auth')

//上傳檔案設定
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//註冊、登入、登出
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.loginPage)
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
}), userController.login)

router.post('/login/orderBack', passport.authenticate('local'))

router.get('/logout', userController.logout)

//會員帳號管理
router.get('/account', authenticator, userController.accountPage)
router.get('/account/:id/edit', authenticator, userController.editAccount)
router.put('/account/:id', authenticator, upload.single('image'), userController.putAccount)
router.get('/likeCommodities', authenticator, userController.likeCommoditiesPage)

module.exports = router