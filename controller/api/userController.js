const userService = require('../../services/userService')
const { checkString } = require('../../utils/checkDataFormat')
const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    const userData = req.user.toJSON()
    delete userData.password
    delete userData.createdAt
    delete userData.updatedAt
    const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
    res.json({
      status: 'success',
      message: '登入成功',
      result: {
        token,
        user: userData
      }
    })
  },
  register: (req, res, next) => {
    const {name, email, password} = req.body
    // 填入資料檢驗
    const pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
    if (!pattern.test(email)) throw new Error('信箱格式不正確')
    if(!checkString(password)) throw new Error('密碼為必填項目')
    if(!checkString(name)) throw new Error('姓名為必填項目')
    
    userService.register(name, email, password)
    .then(message => 
      res.status(200).json({
      status: 'success',
      message
    }))
    .catch(err => next(err))
  },
  likeCommodities: (req, res, next) => {
    userService.likeCommodities(req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  cartCommodities: (req, res, next) => {
    userService.cartCommodities(req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  userAccountData: (req, res, next) => {
    userService.userAccountData(req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  userData: (req, res, next) => {
    userService.userData(req.user.id)
    .then(data => 
      res.status(200).json({
      status: 'success',
      result: data
    }))
    .catch(err => next(err))
  },
  editUserData: (req, res, next) => {
    const { name, email, phone, address } = req.body
    const { file } = req
    // 檢查格式是否正確
    const pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
    if (!pattern.test(email)) throw new Error('信箱格式不正確')
    if(!checkString(name)) throw new Error('姓名為必填項目')
    if(!checkString(phone)) throw new Error('電話為必填項目')
    if(!checkString(address)) throw new Error('地址為必填項目')

    userService.editUserData(req.user.id, name, email, phone, address, file)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  }
}

module.exports = userController