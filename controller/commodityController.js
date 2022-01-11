const db = require('../models')
const { commodityPage } = require('./adminController')
const Commodity = db.Commodity
const Category = db.Category

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
    }
}

module.exports = commodityController