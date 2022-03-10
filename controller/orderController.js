const moment = require('moment')
const db = require('../models')
const Cart = db.Cart
const Commodity = db.Commodity
const Order = db.Order
const OrderItem = db.OrderItem
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
      return res.render('orderInformation', { cartData, totalAmount, user: req.user })
    })
  },
  confirmInformation: (req, res) => {
    const { email, phone, address, totalAmount } = req.body
    Order.create({
      email, phone, address, totalAmount,
      userId: req.user.id
    })
    .then(order => {
      Cart.findAll({
        raw: true, nest: true,
        where: { userId: req.user.id},
        include: [ Commodity ]
      })
      .then(cart => {  
        const cartData = cart.filter(i => !i.Commodity.removed)
        .map(i => ({
          quantity: i.quantity,
          price: i.Commodity.price,
          commodityId: i.commodityId,
          orderId: order.id
        }))
        return cartData
      })
      .then(cartData => {
        for ( let i of cartData) {
          OrderItem.create(i)
        }
        const payData = newebpay.getTradeInfo(totalAmount, req.user.email, order.id)
        return res.render('confirmInformation', { payData, email, phone, address, totalAmount })
      })
    })
  },
  mpgatewayCallback: async (req, res) => {
    if (req.body.Status === 'SUCCESS') {
      const TradeInfo = JSON.parse(newebpay.decryptTradeInfoAES(req.body.TradeInfo))
      const orderId = Number(TradeInfo['Result']['MerchantOrderNo'].slice(10))
      await Cart.destroy({where: {userId: req.user.id}})
      await Order.findByPk(orderId, {include: [ OrderItem ]})
      .then(async (order) => {
        order.update({ status: true })
        const orderItems = order.toJSON().OrderItems
        for ( let i of orderItems) { 
          await Commodity.findByPk(i.commodityId)
          .then(commodity => {
            commodity.increment({ saleAmount: i.quantity })
            commodity.decrement({ remainingNumber: i.quantity })
            if (commodity.dataValues.remainingNumber === i.quantity) {
              commodity.update({ removed: true})
            }
          })
        }
      })
      return res.render('orderSucceed')
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
