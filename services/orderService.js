const { Commodity, Cart, Order, OrderItem, sequelize } = require('../models')

const orderService = {
  createOrder: (userId, email, phone, address) => {
    return new Promise(async (resolve, reject) => {
      const t = await sequelize.transaction()
      try {
        // 取出購物車資料
        const cartData = await Cart.findAll({
          raw: true,
          nest: true,
          attributes: { 
            include: [
              [sequelize.literal('(SELECT price FROM Commodities WHERE id = commodityId)'), 'price'],
              [sequelize.literal('(SELECT removed FROM Commodities WHERE id = commodityId)'), 'removed'],
              [sequelize.literal('(SELECT name FROM Commodities WHERE id = commodityId)'), 'name']
            ],
            exclude: ['id', 'userId', 'createdAt', 'updatedAt'] 
          },
          include: [{ model: Commodity, attributes: [] }],
          where: { userId },
          having: { removed: false }
        })
        if (cartData.length === 0) throw new Error('該使用者購物車內並沒有商品')

        // 判斷是否庫存足夠，足夠再預留商品數量給使用者結帳購買
        for (let i of cartData) {
          const commodity =  await Commodity.findByPk(i.commodityId, {
            attributes: ['id', 'remainingNumber']
          })
          if (commodity.dataValues.remainingNumber < i.quantity) throw new Error(`${i.name}庫存不足，無法購買`)
          if (commodity.dataValues.remainingNumber === i.quantity) {
            await commodity.update({removed: true}, { transaction: t })
          }
          await commodity.decrement({remainingNumber: i.quantity}, { transaction: t })
        }

        // 建立訂單
        const totalAmount = cartData.map(i => i.quantity * i.price).reduce((a,b)=> a + b)
        const order = await Order.create({ userId, email, phone, address, totalAmount}, { transaction: t })
        for (let i of cartData) {
          await OrderItem.create({
            quantity: i.quantity,
            price: i.price,
            commodityId: i.commodityId,
            orderId: order.id
          }, { transaction: t })
        }

        await t.commit()
        return resolve(order.id)
      } catch (err) {
        await t.rollback()
        return reject(err)
      }
    })
  },
  updateOrder: (orderId, userId) => {
    return new Promise(async (resolve, reject) => {
      const t = await sequelize.transaction()
      try {
      
      // 更新訂單內容
      const order = await Order.findByPk(orderId, { attributes: ['id', 'status']})
      if (!order) throw new Error('輸入錯誤的訂單Id')
      if (order.dataValues.status) throw new Error('該訂單已經更新過了')
      await order.update({ status: true }, { transaction: t })
      const orderData = await OrderItem.findAll({
        raw: true,
        nest: true,
        where: { orderId },
        attributes: ['commodityId', 'quantity']
      })

        // 清空購物車
        await Cart.destroy({where: { userId }}, { transaction: t })

        // 更新商品銷售量
        for (let i of orderData) {
          const commodity = await Commodity.findByPk(i.commodityId)
          await commodity.increment({ saleAmount: i.quantity }, { transaction: t })
        }
        await t.commit()
        return resolve('成功更新交易資料')
      } catch (err) {
        await t.rollback()
        return reject(err)
      }
    })
  },
  failOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      const t = await sequelize.transaction()
      try {
        // 確認輸入正確的訂單Id
        const order = await Order.findByPk(orderId, { attributes: ['id', 'status']})
        if (!order) throw new Error('輸入錯誤的訂單Id')
        if (order.dataValues.status) throw new Error('該訂單已完成')
        
        // 找出訂單的內容有哪些
        const orderItem = await OrderItem.findAll({
          raw: true,
          nest: true,
          attributes: ['quantity', 'commodityId'],
          where: { orderId }
        })

        // 將預留的庫存返回原樣
        for (let i of orderItem) {
          const commodity = await Commodity.findByPk(i.commodityId, { attributes: ['id', 'removed']})
          if (commodity.dataValues.removed) {
            await commodity.update({removed: false}, { transaction: t })
          }
          await commodity.increment({ remainingNumber: i.quantity }, { transaction: t })
        }

        // 刪除交易失敗的訂單
        await OrderItem.destroy({where: { orderId }}, { transaction: t })
        await Order.destroy({where: { id: orderId }}, { transaction: t })

        await t.commit()
        return resolve('成功刪除交易失敗訂單')
      } catch (err) {
        await t.rollback()
        return reject(err)
      }
    })
  }
}

module.exports = orderService