const db = require('../models')
const Cart = db.Cart
const Commodity = db.Commodity
const Order = db.Order
const newebpay = require('../utils/newebpay')

const orderController = {
    orderInformation: (req, res) => {
        Cart.findAll({
            raw: true, nest: true,
            where: { userId: req.user.id},
            include: [ Commodity ]
        })
        .then(cart => {  
            const cartData = cart.filter(i => !i.Commodity.removed)
            const totalAmount = cartData.map(i => i.quantity * i.Commodity.price).reduce((a,b)=> a + b)
            return res.render('orderInformation', { cart: cartData, totalAmount, user: req.user })
        })
    },
    confirmInformation: (req, res) => {
        const { email, phone, address, totalAmount } = req.body
        console.log(email, phone, address, totalAmount)
        Order.create({
            email, phone, address, totalAmount,
            userId: req.user.id
        })
        .then (() => {
            const payData = newebpay.getTradeInfo(totalAmount, req.user.email)
            return res.render('confirmInformation', { payData })
        })
    },
    mpgatewayCallback: (req, res) => {
        console.log(req.method); // 總共四次，回傳前 post 3 次，確認電商網站是否正常。
        console.log(req.query); // 回傳 { from: NotifyURL}，第四次回傳 { from: ReturnURL}
        console.log(req.body); // 回傳的 object 解碼使用
        console.log(newebpay.decryptTradeInfoAES(req.body.TradeInfo))
        res.render('index')
    }
}

module.exports = orderController
