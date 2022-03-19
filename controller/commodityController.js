const { Like } = require('../models')
const commodityService = require('../services/commodityService')
const userService = require('../services/userService')

const commodityController = {
  commoditiesPage: async (req, res)=>{
    try {
      const token = req.flash('token')
      const categoryId = 'all'
      const category = await commodityService.getCategories()
      const commodity = await commodityService.getCommodities(false)
      const result = commodity.map(i => ({
        ...i,
        likedUser: req.user.LikedCommodities.map(d => d.id).includes(i.id),
        inCart: req.user.Carts.map(c => c.commodityId).includes(i.id)
      }))
      if (token.length === 0) {
        return res.render('index', { commodity: result, category, categoryId })
      } else {
        return res.render('index', { commodity: result, category, categoryId, token })
      }
    } catch (err) {
      return res.render('error', { err: err.message })
    }
  },
  commodityPage: async (req, res) => {
    try {
      const commodityId = Number(req.params.id)
      const commodity = await commodityService.getCommodity(commodityId)
      const likedUser = [...await userService.likeCommodities(req.user.id)].some(i => i.id === commodityId)
      const inCart = [...await userService.cartCommodities(req.user.id)].some(i => i.CommodityId === commodityId)
      console.log(likedUser, inCart)
      return res.render('commodity', { commodity, likedUser, inCart, backURL: req.headers.referer})
    } catch (err) {
      return res.render('error', { err: err.message })
    }
  },
  useCategoryfindCommodity: async (req, res)=>{
    try {
      const categoryId = req.params.id
      const category = await commodityService.getCategories()
      const commodity = await commodityService.useCategoryfindCommodity(categoryId, false)
      const result = commodity.map(i => ({
        ...i,
        likedUser: req.user.LikedCommodities.map(d => d.id).includes(i.id),
        inCart: req.user.Carts.map(c => c.commodityId).includes(i.id)
      }))
      return res.render('index', { commodity: result, category, categoryId })
    } catch (err) {
      return res.render('error', { err: err.message })
    }
  },
  searchCommodity: async (req, res) => {
    try {
      const category = await commodityService.getCategories()
      const commodity = await commodityService.searchCommodity(req.query.name)
      const result = commodity.map(i => ({
        ...i,
        likedUser: req.user.LikedCommodities.map(d => d.id).includes(i.id),
        inCart: req.user.Carts.map(c => c.commodityId).includes(i.id)
      }))
      return res.render('index', { commodity: result, category })
    } catch (err) {
      return res.render('error', { err: err.message })
    }
  },
  addLike: (req, res) => {
    Like.create({
      CommodityId: req.params.commodiytId,
      UserId: req.user.id
    })
    .then(() => res.json({ "status": "success" }))
  },
  removeLike: (req, res) => {
    Like.destroy({ 
      where: { 
        CommodityId: req.params.commodiytId,
        UserId: req.user.id
      } 
    })
    .then(() => res.json({ "status": "success" }))
  }
}

module.exports = commodityController