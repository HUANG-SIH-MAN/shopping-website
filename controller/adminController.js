const db = require('../models')
const Commodity = db.Commodity
const Category = db.Category

const adminController = {
    commoditiesPage: (req, res) => {
        Commodity.findAll( { raw: true, nest: true, include: [ Category ] } ) 
        .then(commodity => res.render('admin/commodities', { commodity }))
    },
    commodityPage: (req, res) => {
        Commodity.findByPk(req.params.id ,{
            include: [ Category ] 
        })
        .then(commodity => res.render('admin/commodity', { commodity: commodity.toJSON() }))
    },
    editCommodity: (req, res) => {
        Commodity.findByPk(req.params.id ,{
            include: [ Category ] 
        })
        .then(commodity => res.render('admin/editCommodity', { commodity: commodity.toJSON() }))
    }
}

module.exports = adminController