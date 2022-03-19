const { Commodity, Category, Like } = require('../models')
const sequelize = require('sequelize')
const { Op } = sequelize

const commodityService = {
  getCommodities: (removed) => {
    return new Promise((resolve, reject) => {
      Commodity.findAll({
        raw: true,
        nest: true,
        group: 'id',
        where: { removed },
        attributes: { 
          include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
          exclude: ['createdAt', 'updatedAt'] 
        },
        order: [['viewCount', "DESC"]],
      })
      .then(commodity => resolve(commodity))
      .catch(err => reject(err))
    })
  },
  getCommodity: (id) => {
    return new Promise((resolve, reject) => {
      Commodity.findByPk(id, {
        raw: true,
        attributes: { 
          include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
          exclude: ['createdAt', 'updatedAt'] 
        },
      })
      .then(commodity => {
        if (!commodity) throw new Error('輸入錯誤商品id，查詢不到相關資料')
        // commodity.increment({viewCount: 1})
        return resolve(commodity)
      })
      .catch(err => reject(err))
    })
  },
  useCategoryfindCommodity: (categoryId, removed) => {
    return new Promise((resolve, reject) => {
      Promise.all([
        Commodity.findAll({
          raw: true,
          nest: true,
          group: 'id',
          where: { categoryId, removed },
          attributes: { 
            include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
            exclude: ['createdAt', 'updatedAt'] 
          },
          order: [['viewCount', "DESC"]],
        }),
        Category.findByPk(categoryId)
      ])
      .then(([commodity, category]) => {
        if(!category) throw new Error('輸入錯誤商品分類id，查詢不到相關資料')
        if (commodity.length === 0) throw new Error('該分類目前還沒有商品，請耐心等待商家上架!!')
        return resolve(commodity)
      })
      .catch(err => reject(err))
    })
  },
  searchCommodity: (keyword) => {
    return new Promise((resolve, reject) => {
      Commodity.findAll({
        raw: true,
        nest: true,
        group: 'id',
        where: { removed: false, name:{ [Op.like]: `%${keyword}%` } },
        attributes: { 
          include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
          exclude: ['createdAt', 'updatedAt'] 
        },
        order: [['viewCount', "DESC"]],
      })
      .then(commodity => {
        if (commodity.length === 0) throw new Error(`使用${keyword}當關鍵字，查詢不到相關資料`)
        return resolve(commodity)
      })
      .catch(err => reject(err))
    })
  },
  getCategories: () => {
    return new Promise((resolve, reject) => {
      Category.findAll({ 
        raw: true, nest: true,
        attributes: ['id', 'name']
      })
      .then(category => resolve(category))
      .catch(err => reject(err))
    })
  },
  likeCommodity: (UserId, CommodityId) => {
    return new Promise((resolve, reject) => {
      Like.findOrCreate({
        where: { UserId, CommodityId }
      })
      .then(like => {
        if (!like[1]) throw new Error('該商品已經被使用者加入最愛')
        resolve('成功將商品加入最愛')
      })
      .catch(err => reject(err))
    })
  },
  unlikeCommodity: (UserId, CommodityId) => {
    return new Promise((resolve, reject) => {
      Like.destroy({
        where: { UserId, CommodityId }
      })
      .then(() => {
        resolve('成功將移除最愛商品')
      })
      .catch(err => reject(err))
    })
  }
}

module.exports = commodityService
