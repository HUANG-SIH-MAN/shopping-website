const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

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
}

module.exports = userController