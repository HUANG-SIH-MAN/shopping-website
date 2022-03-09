const commodityService = require('../../services/commodityService')

const commodityController = {
  getCommodities: (req, res, next) => {
    commodityService.getCommodities(false, (err, data) => err 
    ? next(err) 
    : res.status(200).json({
      status: 'success',
      result: data
    }))
  },
  getCommodity: (req, res, next) => {
    commodityService.getCommodity(req.params.id, (err, data) => err 
    ? next(err) 
    : res.status(200).json({
      status: 'success',
      result: data
    }))
  }
}

module.exports = commodityController