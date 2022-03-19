const { Commodity, Cart, Order, OrderItem } = require('../models')

const orderService = {
  updateOrder: (orderId, userId) => {
    return new Promise(async (resolve, reject) => {
      // 清空購物車
      await Cart.destroy({where: { userId }})
      // 更新訂單內容
      await Order.update({ status: true }, { where: { id: orderId}})
      const orderData = await OrderItem.findAll({
        raw: true,
        nest: true,
        where: { orderId },
        attributes: ['commodityId', 'quantity']
      })
      // 更新商品資訊(庫存量、銷售量)，庫存為零時自動下架
      for (let i of orderData) {
        await Commodity.findByPk(i.commodityId)
        .then(commodity => {
          commodity.increment({ saleAmount: i.quantity })
          commodity.decrement({ remainingNumber: i.quantity })
          if (commodity.dataValues.remainingNumber === i.quantity) {
            commodity.update({ removed: true})
          }
        })
      }
      return resolve('成功更新交易資料')
    })
  }
}

module.exports = orderService