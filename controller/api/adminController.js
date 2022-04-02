const adminService = require('../../services/adminService')
const commodityService = require('../../services/commodityService')
const { checkString, checkNumber } = require('../../utils/checkDataFormat')
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
  },
  addCommodity : (req, res, next) => {
    const { name, price, remainingNumber, CategoryId, introduction } = req.body
    const { file } = req

    // 確認輸入格式是否正確
    if(!checkString(name)) throw new Error('name為必填項目')
    if(!checkNumber(price)) throw new Error('price格式輸入錯誤')
    if(!checkNumber(remainingNumber)) throw new Error('remainingNumber格式輸入錯誤')
    if(!checkNumber(CategoryId)) throw new Error('CategoryId格式輸入錯誤')
    if(!checkString(introduction)) throw new Error('introduction為必填項目')
    if(file === undefined) throw new Error('圖片為必填項目')

    adminService.addCommodity(name, price, remainingNumber, CategoryId, introduction, file)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  },
  editCommodity : (req, res, next) => {
    const { name, price, remainingNumber, CategoryId, introduction } = req.body
    const { file } = req

    // 確認輸入格式是否正確
    if(!checkString(name)) throw new Error('name為必填項目')
    if(!checkNumber(price)) throw new Error('price格式輸入錯誤')
    if(!checkNumber(remainingNumber)) throw new Error('remainingNumber格式輸入錯誤')
    if(!checkNumber(CategoryId)) throw new Error('CategoryId格式輸入錯誤')
    if(!checkString(introduction)) throw new Error('introduction為必填項目')
    if(file === undefined) throw new Error('圖片為必填項目')
    adminService.editCommodity(req.params.id, name, price, remainingNumber, CategoryId, introduction, file)
    .then(data => 
      res.status(200).json({
      status: 'success',
      message: data
    }))
    .catch(err => next(err))
  }
}

module.exports = adminController