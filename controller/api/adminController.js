const adminService = require('../../services/adminService')
const commodityService = require('../../services/commodityService')
const { Op } = require('sequelize')

const adminController = {
  getCommodities: (req, res, next) => {
    commodityService.getCommodities(false)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  getRemovedCommodities: (req, res, next) => {
    commodityService.getCommodities(true)
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
    commodityService.useCategoryfindCommodity(req.params.id, {[Op.in]: [false, true]})
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  }
}

module.exports = adminController