//express框架
const express = require('express')
const app = express()
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const port = process.env.port

//handlebars樣板設定
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

//路由設定
const routes = require('./routers')

app.use(routes)
app.listen(port ,()=>{
    console.log(`localhost:${port}`)
})