const { Commodity, Category } = require('../models')
const sequelize = require('sequelize')

const commodityService = {
  getCommodities: async (req , cb) => {
    try {
      const commoditiesData = await Commodity.findAll({
        raw: true,
        nest: true,
        group: 'id',
        where: { removed: false },
        attributes: { 
          include: [[sequelize.literal('(SELECT name FROM Categories WHERE id = categoryId)'), 'CategoryName']],
          exclude: ['removed', 'createdAt', 'updatedAt'] 
        },
        order: [['viewCount', "DESC"]],
      })
      return cb(null, commoditiesData)
    } catch (err) {
      return cb(err, null)
    }
  }
}


module.exports = commodityService