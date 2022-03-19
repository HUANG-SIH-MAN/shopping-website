const orderService = require('../../services/orderService')

const orderController = {
  updateOrder: (req, res, next) => {
    orderService.updateOrder(req.params.id, req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  }
}

module.exports = orderController