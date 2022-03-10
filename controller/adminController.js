const db = require('../models')
const Commodity = db.Commodity
const Category = db.Category
const User = db.User
const { Op } = require('sequelize')
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
    .then(()=> res.json({ "status": "success" }))
  },
  undoRemovedCommodity: (req, res) => {
    Commodity.findByPk(req.params.id)
    .then(commodity => {
      if (commodity.dataValues.remainingNumber <= 0) {
        return  res.json({ "status": "error", "message": "庫存量必須大於零，才能將商品上架" })
      }
      commodity.update(
        { removed: false }, 
        { where: { id: req.params.id, remainingNumber: { [Op.gt]: 0 } }}
      )
      .then(()=> res.json({ "status": "success" }))
    })
  },
  deleteCommodity: (req, res) => {
    Commodity.destroy({ 
      where: { id: req.params.id }
    })
    .then(()=> res.redirect('back'))
    .catch(()=> {
      req.flash('error', '該商品已被消費者購買，包含太多相關資料，無法刪除!!')
      return res.redirect('back')
    })
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
  },
  createCategory: (req, res) => {
    return res.render('admin/createCategory')
  },
  postCategory: (req, res) => {
    Category.create({
      name: req.body.name
    })
    .then(()=> res.redirect('/admin/categories'))
  },
  editCategory: (req, res) => {
    Category.findByPk(req.params.id)
    .then(category => res.render('admin/editCategory', { category: category.toJSON() }))
  },
  putCategory: (req, res) => {
    Category.update(
      { name: req.body.name },
      { where: { id: req.params.id }}
    )
    .then(()=> res.redirect('/admin/categories'))
  },
  deleteCategory: (req, res) => {
    Category.destroy({ 
      where: { id: req.params.id }
    })
    .then(()=> res.redirect('back'))
    .catch(()=> {
      req.flash('error', '分類中有商品已被消費者購買，包含太多相關資料，無法刪除!!')
      return res.redirect('back')
    })
  },
  usersPage: (req, res) => {
    User.findAll({
      raw: true, nest: true,
      where: { isAdmin: false }
    })
    .then(customer => res.render('admin/users', { customer }))
  }
}
module.exports = adminController