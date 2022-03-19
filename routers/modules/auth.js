const express = require('express')
const passport = require('passport')
const router = express.Router()
const userController = require('../../controller/userController')

router.get('/facebook', 
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/login' 
}), userController.login)

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login' 
}), userController.login)

router.get('/twitter',
  passport.authenticate('twitter', { scope: ['profile', 'email'] })
)

router.get('/twitter/callback', 
  passport.authenticate('twitter', { 
    failureRedirect: '/login' 
}), userController.login)

module.exports = router