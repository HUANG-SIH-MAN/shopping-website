const { Commodity, Category } = require('../models')
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
        return resolve(commodity)
      })
      .catch(err => reject(err))
    })
  },
  useCategoryfindCommodity: (categoryId, removed) => {
    return new Promise((resolve, reject) => {
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
      })
      .then(commodity => {
        if (commodity.length === 0) throw new Error('輸入錯誤商品分類id，查詢不到相關資料')
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
  }
}

module.exports = commodityService
