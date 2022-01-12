const db = require('../models')
const Commodity = db.Commodity
const Category = db.Category
const { Op } = require('sequelize')

const commodityController = {
    commoditiesPage: async (req, res)=>{
        const categoryId = 'all'
        const category = await Category.findAll({raw: true, nest: true})
        Commodity.findAll({ 
            raw: true, nest: true,
            where: { removed: false },
            include: [ Category ],
            order: [['viewCount', "DESC"]] 
        })
        .then(commodity => res.render('index', { commodity, category, categoryId }))
    },
    commodityPage: (req, res) => {
        Commodity.findByPk(req.params.id, { include: [ Category ] })
        .then(commodity => {
            commodity.increment({viewCount: 1})
            return res.render('commodity', { commodity: commodity.toJSON() })
        })
    },
    useCategoryfindCommodity: async (req, res)=>{
        const category = await Category.findAll({raw: true, nest: true})
        const categoryId = req.params.id
        Commodity.findAll({ 
            raw: true, nest: true,
            where: { removed: false, categoryId },
            include: [ Category ],
            order: [['viewCount', "DESC"]]
        })
        .then(commodity => res.render('index', { commodity, category, categoryId }))
    },
    searchCommodity: async (req, res) => {
        const category = await Category.findAll({raw: true, nest: true})
        Commodity.findAll({
            raw: true, nest: true,
            where: { removed: false, name:{ [Op.like]: `%${req.body.name}%` } },
            include: [ Category ],
            order: [['viewCount', "DESC"]]
        })
        .then(commodity => {
            let searchError = ''
            if (commodity.length === 0) {
                searchError = '搜尋不到相關產品!!請重新輸入關鍵字'
            }
            return res.render('index', { commodity, category, searchError })
        })
    }
}

module.exports = commodityController