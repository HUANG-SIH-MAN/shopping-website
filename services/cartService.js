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
  }
}

module.exports = cartService