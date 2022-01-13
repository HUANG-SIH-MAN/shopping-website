const passport = require('passport') 
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook') 
const GoogleStrategy = require('passport-google-oauth20').Strategy 
const TwitterStrategy = require('passport-twitter').Strategy
const db = require('../models')
const User = db.User
const Commodity = db.Commodity

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

    //設定Facebook登入策略
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']  
    }, (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        User.findOne({where: { email: email }})
        .then(user => {
            if (user) return done(null, user)
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
                User.create({
                    name,
                    email,
                    password: hash
                })
                .then(()=> done(null, user))
                .catch(err => done(err, false))
            })
        })
    }))

    //設定Google登入策略
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK
      },(accessToken, refreshToken, profile, cb) => {
        const { name, email } = profile._json
        User.findOne({where: { email: email }})
        .then(user => {
            if (user) return cb(null, user)
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
                User.create({
                    name,
                    email,
                    password: hash
                })
                .then(()=> cd(null, user))
                .catch(err => cd(err, false))
            })
        })
      }
    ))

    //設定twitter登入策略
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
        callbackURL: process.env.TWITTER_CALLBACK
      },(token, tokenSecret, profile, cb) => {
        const { name, email } = profile._json
        User.findOne({where: { email: email }})
        .then(user => {
            if (user) return cb(null, user)
            const randomPassword = Math.random().toString(36).slice(-8)
            bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => {
                User.create({
                    name,
                    email,
                    password: hash
                })
                .then(()=> cd(null, user))
                .catch(err => cd(err, false))
            })
        })
      }
    ))

    //序列化/反序列化 
    passport.serializeUser((user, done) => { 
        done(null, user.id) 
    }) 
    passport.deserializeUser((id, done) => { 
        User.findByPk(id,{
            include: [{ model: Commodity, as: 'LikedCommodities' }]
        }) 
        .then(user => done(null, user.toJSON())) 
        .catch(err => done(err, null)) 
    }) 
}