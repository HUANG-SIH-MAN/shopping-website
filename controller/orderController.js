const moment = require('moment')
const db = require('../models')
const Cart = db.Cart
const Commodity = db.Commodity
const Order = db.Order
const OrderItem = db.OrderItem
const newebpay = require('../utils/newebpay')
const orderService = require('../services/orderService')

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
      return res.render('orderInformation', { cartData, totalAmount, user: req.user })
    })
  },
  confirmInformation: async (req, res) => {
    try {
      const { email, phone, address, totalAmount } = req.body
      const orderId = await orderService.createOrder(req.user.id, email, phone, address)
      const payData = newebpay.getTradeInfo(totalAmount, req.user.email, orderId)
      return res.render('confirmInformation', { payData, email, phone, address, totalAmount })
    } catch (err) {
      return res.render('error', { err: err.message })
    }
  },
  mpgatewayCallback: async (req, res) => {
    try {
      // 解密交易資訊
      const TradeInfo = JSON.parse(newebpay.decryptTradeInfoAES(req.body.TradeInfo))
      const orderId = Number(TradeInfo['Result']['MerchantOrderNo'].slice(10))
      if (req.body.Status === 'SUCCESS') {
        return res.render('orderSucceed', { orderId })
      } else {
        await orderService.failOrder(orderId)
        return res.render('error', { err: '交易失敗，請重新結帳' })
      }
    } catch (err) {
      return res.render('error', { err: err.message })
    }
    
  },
  orderRecords: (req, res) => {
    Order.findAll({
      where: { userId: req.user.id, status: true },
      include: [{ model: OrderItem, include: Commodity }],
      order: [['updatedAt', "DESC"]]
    })
    .then(order => {
      if (order.length === 0) {
        return res.render('orderRecords', { orderRecordError: '並未購買任何商品!!' })
      }
      const orderData = order.map(i => ({
        address: i.dataValues.address,
        totalAmount: i.dataValues.totalAmount,
        updatedAt: moment(i.dataValues.updatedAt).format('YYYY-MM-DD'),
        OrderItems: i.dataValues.OrderItems.map(i => i.dataValues)
      }))
      return res.render('orderRecords', { order: orderData })
    })
  }
}

module.exports = orderController
