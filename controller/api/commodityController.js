const commodityService = require('../../services/commodityService')

const commodityController = {
  getCommodities: (req, res, next) => {
    commodityService.getCommodities(req, (err, data) => err 
    ? next(err) 
    : res.status(200).json({
      status: 'success',
      result: data
    }))
  }
}

module.exports = commodityController