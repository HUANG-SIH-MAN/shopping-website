const cartService = require('../../services/cartService')

const cartController = {
  addCommodity: (req, res, next) => {
    cartService.addCommodity(req.user.id, req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  },
  removeCommodity: (req, res, next) => {
    cartService.removeCommodity(req.user.id, req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  },
  addQuantity: (req, res, next) => {
    cartService.addQuantity(req.user.id, req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  },
  reduceQuantity: (req, res, next) => {
    cartService.reduceQuantity(req.user.id, req.params.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  }
}

module.exports = cartController