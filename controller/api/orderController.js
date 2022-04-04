const orderService = require('../../services/orderService')
const { checkString } = require('../../utils/checkDataFormat')

const orderController = {
  createOrder: (req, res, next) => {
    const { email, phone, address } = req.body
    // 檢查格式是否正確
    const pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
    if (!pattern.test(email)) throw new Error('信箱格式不正確')
    if(!checkString(phone)) throw new Error('電話為必填項目')
    if(!checkString(address)) throw new Error('地址為必填項目')

    orderService.createOrder(req.user.id, email, phone, address)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  updateOrder: (req, res, next) => {
    orderService.updateOrder(req.params.id, req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  },
  failOrder: (req, res, next) => {
    orderService.failOrder(req.params.id, req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  }
}

module.exports = orderController