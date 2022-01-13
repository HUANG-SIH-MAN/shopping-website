const db = require('../models')
const Commodity = db.Commodity
const Category = db.Category
const User = db.User
const Like = db.Like
const { Op } = require('sequelize')

const commodityController = {
    commoditiesPage: async (req, res)=>{
        const categoryId = 'all'
        const category = await Category.findAll({raw: true, nest: true})
        Commodity.findAll({ 
            where: { removed: false },
            include: [ Category ],
            order: [['viewCount', "DESC"]] 
        })
        .then(commodity => {
            const result = commodity.map(i =>({
                ...i.dataValues,
                Category: i.dataValues.Category.dataValues,
                likedUser: req.user.LikedCommodities.map(d => d.id).includes(i.id)
            }))
            return res.render('index', { commodity: result, category, categoryId })
        })
    },
    commodityPage: (req, res) => {
        Commodity.findByPk(req.params.id, {
            include: [ 
                Category,
                { model: User, as: 'LikedUsers' } 
            ] 
        })
        .then(commodity => {
            const likedUser = commodity.toJSON().LikedUsers.some(i => i.id === req.user.id)
            commodity.increment({viewCount: 1})
            return res.render('commodity', { commodity: commodity.toJSON(), likedUser })
        })
    },
    useCategoryfindCommodity: async (req, res)=>{
        const category = await Category.findAll({raw: true, nest: true})
        const categoryId = req.params.id
        Commodity.findAll({ 
            where: { removed: false, categoryId },
            include: [ Category ],
            order: [['viewCount', "DESC"]]
        })
        .then(commodity => {
            const result = commodity.map(i =>({
                ...i.dataValues,
                Category: i.dataValues.Category.dataValues,
                likedUser: req.user.LikedCommodities.map(d => d.id).includes(i.id)
            }))
            return res.render('index', { commodity: result, category, categoryId })
        })
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
    },
    addLike: (req, res) => {
        Like.create({
            CommodityId: req.params.commodiytId,
            UserId: req.user.id
        })
        .then(() => res.redirect('back'))
    },
    removeLike: (req, res) => {
        Like.destroy({ 
            where: { 
                CommodityId: req.params.commodiytId,
                UserId: req.user.id
            } 
        })
        .then(() => res.redirect('back'))
    }
}

module.exports = commodityController