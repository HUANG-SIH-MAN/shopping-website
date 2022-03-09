const { Commodity, Category } = require('../models')
const sequelize = require('sequelize')

const commodityService = {
  getCommodities: async (removed, cb) => {
    try {
      const commoditiesData = await Commodity.findAll({
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
      return cb(null, commoditiesData)
    } catch (err) {
      return cb(err, null)
    }
  },
  getCommodity: async (id, cb) => {
    try {
      const commodityData = await Commodity.findByPk(id, {
        raw: true,
        attributes: { 
          include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
          exclude: ['createdAt', 'updatedAt'] 
        },
      })
      return cb(null, commodityData)
    } catch (err) {
      return cb(err, null)
    }
  }
}


module.exports = commodityService