//express框架
const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const PORT = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))

//handlebars樣板設定
const handlebarsHelper = require('./utils/handlebarsHelper')
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' , helpers: handlebarsHelper}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

//session 儲存使用者認證狀態
const session = require('express-session')
app.use(session({ 
    secret: process.env.sessionSecret,
    name: 'user', 
    resave: false, 
    saveUninitialized: true
}))

//passport 登入設定
const usePassport = require('./config/passport')
usePassport(app)

//flash製作提示訊息
const flash = require('connect-flash')
app.use(flash())
app.use((req, res, next) => {
    const start = req.headers.cookie.indexOf('user')
    res.cookie('user', req.headers.cookie.slice(start + 5) ,{ httpOnly: true, sameSite: 'none', secure: true })
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    res.locals.error_msg = req.flash('error')
    res.locals.success_msg = req.flash('success')
    next()
})

//cors設定
const cors = require('cors')
app.use(cors())

//路由設定
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
const routes = require('./routers')
app.use(routes)
app.listen(PORT ,()=>{
    console.log(`localhost:${PORT}`)
})