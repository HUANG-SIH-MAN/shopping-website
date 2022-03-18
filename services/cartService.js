const { Commodity, Cart } = require('../models')

const cartService = {
  addCommodity: (userId, commodityId) => {
    return new Promise((resolve, reject) => {
      Commodity.findByPk(commodityId, {raw: true})
      .then(commodity => {
        if(!commodity) throw new Error('輸入錯誤商品Id，該商品不存在')
        if(commodity.removed) throw new Error('該商品已經下架')
        if(commodity.remainingNumber === 0) throw new Error('商品沒有庫存')
        Cart.findOrCreate({
          where: { userId, commodityId }
        })
        .then(cart => {
          if(!cart[1]) throw new Error('該商品已經加入購物車')
          return resolve('成功將商品加入購物車')
        })
        .catch(err => reject(err))
      })
      .catch(err => reject(err))
    })
  },
  removeCommodity: (userId, commodityId) => {
    return new Promise((resolve, reject) => {
      Cart.destroy({
        where: { userId, commodityId }
      })
      .then(() => resolve('成功將商品從購物車移除'))
      .catch(err => reject(err))
    })
  },
  addQuantity: (userId, commodityId) => {
    return new Promise((resolve, reject) => {
      Promise.all([
        Commodity.findByPk(commodityId, {raw: true}),
        Cart.findOne({ raw: true, where: { userId, commodityId }})
      ])
      .then(([commodity, cart]) => {
        if(!commodity) throw new Error('輸入錯誤商品Id，該商品不存在')
        if(!cart) throw new Error('輸入錯誤商品Id，該商品未加入購物車')
        const remainingNumber = commodity.remainingNumber
        const quantity = cart.quantity
        if (quantity >= remainingNumber) {
          Cart.update({ quantity: remainingNumber }, { where: { userId, commodityId }})
          throw new Error(`商品庫存數量只有${remainingNumber}，無法再增加`)
        } 
        Cart.update({ quantity: quantity + 1 }, { where: { userId, commodityId }})
        .then(()=> resolve('成功增加商品數量'))
      })
      .catch(err => reject(err))
    })
  },
  reduceQuantity: (userId, commodityId) => {
    return new Promise((resolve, reject) => {
      Promise.all([
        Commodity.findByPk(commodityId, {raw: true}),
        Cart.findOne({ raw: true, where: { userId, commodityId }})
      ])
      .then(([commodity, cart]) => {
        if(!commodity) throw new Error('輸入錯誤商品Id，該商品不存在')
        if(!cart) throw new Error('輸入錯誤商品Id，該商品未加入購物車')
        const remainingNumber = commodity.remainingNumber
        const quantity = cart.quantity
        if (quantity >= remainingNumber) {
          Cart.update({ quantity: remainingNumber }, { where: { userId, commodityId }})
          throw new Error(`商品庫存數量只有${remainingNumber}`)
        } else if (quantity <= 1) {
          throw new Error('商品數量至少為1')
        } 
        Cart.update({ quantity: quantity - 1 }, { where: { userId, commodityId }})
        .then(()=> resolve('成功減少商品數量'))
      })
      .catch(err => reject(err))
    })
  }
}

module.exports = cartService