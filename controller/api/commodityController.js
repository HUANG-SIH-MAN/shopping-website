const commodityService = require('../../services/commodityService')

const commodityController = {
  getCommodities: (req, res, next) => {
    commodityService.getCommodities(false)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  getCommodity: (req, res, next) => {
    commodityService.getCommodity(req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  useCategoryfindCommodity: (req, res, next) => {
    commodityService.useCategoryfindCommodity(req.params.id, false)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  searchCommodity: (req, res, next) => {
    commodityService.searchCommodity(req.query.name)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  getCategories: (req, res, next) => {
    commodityService.getCategories()
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  likeCommodity: (req, res, next) => {
    commodityService.likeCommodity(req.user.id, req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  },
  unlikeCommodity: (req, res, next) => {
    commodityService.unlikeCommodity(req.user.id, req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  }
}

module.exports = commodityController