const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Commodity = db.Commodity
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
    registerPage: (req, res) => {
        return res.render('register')
    },
    register: (req, res) => {
        //取得表單資料
        const { name, email, password, confirmPassword } = req.body
        //確認密碼
        if (password !== confirmPassword) {
            req.flash('error', '密碼與確認密碼不符')
            return res.redirect('/users/register')
        }
        //確認使用者是否註冊過
        User.findOne({where: { email: email }})
        .then(user => {
            if (user) {
                req.flash('error', '該信箱已經註冊過，請重新輸入')
                return res.redirect('/users/register')
            } else {
                User.create({
                    name,
                    email,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                })
                .then(()=> res.redirect('/users/login'))
            }
        })
    },
    loginPage: (req, res) => {
        return res.render('login')
    },
    login: (req, res) => {
        return res.render('/')
    },
    logout: (req, res) => {
        req.logout()
        req.flash('success', '已經成功登出')
        res.redirect('/users/login')
    },
    accountPage: (req, res) => {
        User.findByPk(req.user.id, {
            include: [{ model: Commodity, as: 'LikedCommodities' }]
        })
        .then(user => {
            return res.render('userAccount', { user: user.toJSON() })
        })
    },
    editAccount: (req, res) => {
        User.findByPk(req.params.id)
        .then(user => res.render('editAccount', { user: user.toJSON() }))
    },
    putAccount: (req, res) => {
        const { file } = req
        const { name, phone, address } = req.body
        if (!file) {
            User.update(
                { name, phone, address }, 
                { where: { id: req.params.id }}
            )
            .then(() => res.redirect('/users/account'))
        } else {
            fs.readFile(file.path, (err, data) => {
                if (err) console.log('Error: ', err)
                imgur.setClientID(IMGUR_CLIENT_ID)
                imgur.upload(file.path, (err, img) => {
                    return User.update(
                        { name, phone, address, image: img.data.link }, 
                        { where: { id: req.params.id }
                    })
                  .then(()=> res.redirect('/users/account'))
              })
            })
        }    
    },
    likeCommoditiesPage: (req, res) => {
        User.findByPk(req.user.id, {
            include: [{ model: Commodity, as: 'LikedCommodities' }]
        })
        .then(user => {
            return res.render('likeCommodities', { user: user.toJSON() })
        })
    }
}

module.exports = userController