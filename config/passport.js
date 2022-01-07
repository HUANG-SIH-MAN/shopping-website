const passport = require('passport') 
const bcrypt = require('bcryptjs') 
const LocalStrategy = require('passport-local').Strategy 
const db = require('../models')
const User = db.User

module.exports = app => { 
    //初始化 
    app.use(passport.initialize()) 
    app.use(passport.session()) 
    //設定本地登入策略 
    passport.use(new LocalStrategy({ usernameField: 'email' , passReqToCallback: true } 
    ,(req, email, password, done) => { 
        User.findOne({where: { email: email }})
        .then(user => { 
            if (!user) return done(null, false, { message: '此電子郵件並未被註冊!!' }) 
            return bcrypt.compare(password, user.password) 
            .then(isMath => { 
                if (!isMath) return done(null, false, { message: '密碼輸入錯誤，請重新輸入!!' }) 
                return done(null, user) 
            }) 
        }) 
        .catch(err => done(err, false)) 
    })) 
    //序列化/反序列化 
    passport.serializeUser((user, done) => { 
        done(null, user.id) 
    }) 
    passport.deserializeUser((id, done) => { 
        User.findByPk(id) 
          .then(user => done(null, user.toJSON())) 
          .catch(err => done(err, null)) 
    }) 
}