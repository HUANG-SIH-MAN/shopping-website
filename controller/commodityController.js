const db = require('../models')
const Like = db.Like
const commodityService = require('../services/commodityService')
const userService = require('../services/userService')

const commodityController = {
  commoditiesPage: async (req, res)=>{
    try {
      const categoryId = 'all'
      const category = await commodityService.getCategories()
      const commodity = await commodityService.getCommodities(false)
      const result = commodity.map(i => ({
        ...i,
        likedUser: req.user.LikedCommodities.map(d => d.id).includes(i.id),
        inCart: req.user.Carts.map(c => c.commodityId).includes(i.id)
      }))
      return res.render('index', { commodity: result, category, categoryId })
    } catch (err) {
      return res.render('error', { err })
    }
  },
  commodityPage: (req, res) => {
    Commodity.findByPk(req.params.id, {
      include: [ 
        Category,
        Cart,
        { model: User, as: 'LikedUsers' } 
      ] 
    })
    .then(commodity => {
      const inCart = commodity.toJSON().Carts.some(i => i.userId === req.user.id)
      const likedUser = commodity.toJSON().LikedUsers.some(i => i.id === req.user.id)
      commodity.increment({viewCount: 1})
      return res.render('commodity', { commodity: commodity.toJSON(), likedUser, inCart, backURL: req.headers.referer})
    })
  },
  // commodityPage: async (req, res) => {
  //   try {
  //     const commodity = await commodityService.getCommodity(req.params.id)
  //     // const likedUser = [...await userService.likeCommodities(req.user.id)].some(i => i.id === req.params.id)
  //     // const inCart = [...await userService.cartCommodities(req.user.id)].some(i => i.CommodityId === req.params.id)
  //     const likedUser = await userService.likeCommodities(req.user.id)
  //     const inCart = await userService.cartCommodities(req.user.id)
  //     console.log(likedUser, inCart)
  //     return res.render('commodity', { commodity, likedUser, inCart, backURL: req.headers.referer})
  //   } catch (err) {
  //     return res.render('error', { err })
  //   }
  // },
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
      return res.render('error', { err })
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
      return res.render('error', { err })
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