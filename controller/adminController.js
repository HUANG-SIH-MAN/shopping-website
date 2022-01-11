const db = require('../models')
const Commodity = db.Commodity
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
    commoditiesPage: (req, res) => {
        Commodity.findAll({
             raw: true, nest: true, 
             where: { removed: false},
             include: [ Category ] 
            }) 
        .then(commodity => res.render('admin/commodities', { commodity }))
    },
    commodityPage: (req, res) => {
        Commodity.findByPk(req.params.id ,{
            include: [ Category ] 
        })
        .then(commodity => res.render('admin/commodity', { commodity: commodity.toJSON() }))
    },
    createCommodity: (req, res) => {
        Category.findAll({
            raw: true, 
            nest: true,
            attributes: ['id', 'name']
        })
        .then( category => res.render('admin/createCommodity', { category }))
    },
    postCommodity: (req, res) => {
        const { file } = req
        const { name, price, remainingNumber, CategoryId, introduction } = req.body
        fs.readFile(file.path, (err, data) => {
            if (err) console.log('Error: ', err)
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                return Commodity.create({
                    name,
                    price,
                    remainingNumber, 
                    CategoryId, 
                    introduction, 
                    image: img.data.link,
                })
              .then(()=> res.redirect('/admin/commodities'))
          })
        })
    },
    editCommodity: async (req, res) => {
        const category = await Category.findAll({
            raw: true, 
            nest: true,
            attributes: ['id', 'name']
        })
        Commodity.findByPk(req.params.id ,{
            include: [ Category ] 
        })
        .then(commodity => res.render('admin/editCommodity', { commodity: commodity.toJSON(), category }))
    },
    putCommodity: (req, res) => {
        const { file } = req
        const { name, price, remainingNumber, CategoryId, introduction } = req.body
        if (!file) {
            Commodity.update(
                { name, price, remainingNumber, CategoryId, introduction }, 
                { where: { id: req.params.id }}
            )
            .then(() => res.redirect(`/admin/commodity/${req.params.id}`))
        } else {
            fs.readFile(file.path, (err, data) => {
                if (err) console.log('Error: ', err)
                imgur.setClientID(IMGUR_CLIENT_ID)
                imgur.upload(file.path, (err, img) => {
                    return Commodity.update(
                        { name, price, remainingNumber, CategoryId, introduction, image: img.data.link }, 
                        { where: { id: req.params.id }
                    })
                  .then(()=> res.redirect(`/admin/commodity/${req.params.id}`))
              })
            })
        }
    },
    removedCommoditiesPage: (req, res) => {
        Commodity.findAll({
            raw: true, nest: true, 
            where: { removed: true},
            include: [ Category ] 
           }) 
       .then(commodity => res.render('admin/removedCommodities', { commodity }))
    },
    removedCommodity: (req, res) => {
        Commodity.update(
            { removed: true }, 
            { where: { id: req.params.id }}
        )
        .then(()=> res.redirect('back'))
    },
    undoRemovedCommodity: (req, res) => {
        Commodity.update(
            { removed: false }, 
            { where: { id: req.params.id }}
        )
        .then(()=> res.redirect('back'))
    },
    deleteCommodity: (req, res) => {
        Commodity.destroy({ 
            where: { id: req.params.id }
        })
        .then(()=> res.redirect('back'))
    },
    categoriesPage: (req, res) => {
        Category.findAll({
            include: [ Commodity ] 
        })
        .then(category => {
            const data = category.map(i => i.dataValues)
            return  res.render('admin/categories', { category: data })
        })
    },
    categoryPage: (req, res) => {
        Category.findByPk(req.params.id, {
            include: [ Commodity ]
        })
        .then(category => {
            return  res.render('admin/category', { category: category.toJSON() })
        })
    }
}
module.exports = adminController