const { User, Commodity, Like, Cart } = require('../models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const imgurUpload = require('../utils/imgurUpload')

const userService = {
  register: (name, email, password) => {
    return new Promise((resolve, reject) => {
      User.findOrCreate({
        where: { email },
        defaults: { 
          name,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          isAdmin: false
        }
      })
      .then(user => {
        if (!user[1]) throw new Error('該信箱已經被註冊過了!!')
        return resolve('註冊成功')
      })
      .catch(err => reject(err))
    })
  },
  likeCommodities: (userId) => {
    return new Promise((resolve, reject) => {
      Like.findAll({
        raw: true, nest: true,
        where: { userId },
        include: [{ model: Commodity, attributes: { 
          include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
          exclude: ['createdAt', 'updatedAt'] 
        }}]  
      })
      .then(commodity => {
        if (commodity.length === 0) throw new Error('使用者沒有喜歡的商品')
        return resolve(commodity.map(i => ({...i.Commodity})))
      })
      .catch(err => reject(err))
    })
  },
  cartCommodities: (userId) => {
    return new Promise((resolve, reject) => {
      Cart.findAll({
        raw: true, nest: true,
        where: { userId },
        attributes: {
          include: [
            [sequelize.literal('(SELECT name FROM Commodities WHERE id = commodityId)'), 'CommodityName'],
            [sequelize.literal('(SELECT price FROM Commodities WHERE id = commodityId)'), 'CommodityPrice'],
            [sequelize.literal('(SELECT image FROM Commodities WHERE id = commodityId)'), 'CommodityImage'],
            [sequelize.literal('(SELECT removed FROM Commodities WHERE id = commodityId)'), 'removed']
          ],
          exclude: ['id', 'userId', 'commodityId', 'createdAt', 'updatedAt']
        }
      })
      .then(commodity => {
        const data = []
        for (let item of commodity) {
          if(item.removed) {
            Cart.destroy({ where: {commodityId: item.CommodityId} })
          } else {
            delete item.removed
            data.push(item)
          }
        }
        if (data.length === 0) throw new Error('使用者的購物車內沒有任何商品')
        return resolve(data)
      })
      .catch(err => reject(err))
    })
  },
  userAccountData: (userId) => {
    return new Promise((resolve, reject) => {
      User.findByPk(userId, { 
        raw: true,
        attributes: [ 'email', 'password']
      })
      .then(user => resolve(user))
      .catch(err => reject(err))
    })
  },
  userData: (userId) => {
    return new Promise((resolve, reject) => {
      User.findByPk(userId, {
        raw: true,
        attributes: {
          exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt']
        }
      })
      .then(user => resolve(user))
      .catch(err => reject(err))
    })
  },
  editUserData: (userId, name, email, phone, address, file) => {
    return new Promise(async(resolve, reject) => {
      try {
        if (!file) {
          await User.update(
            { name, email, phone, address }, 
            { where: { id: userId }}
          )
        } else {
          await User.update({ 
            name, email, phone, address,
            image: await imgurUpload(file)
            }, { where: { id: userId }}
          )
        }
        return resolve('更新個人資料成功')
      } catch (err) {
        return reject(err)
      }
    })
  }
}

module.exports = userService
