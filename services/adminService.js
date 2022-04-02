const { Commodity } = require('../models')
const imgurUpload = require('../utils/imgurUpload')

const adminService = {
  addCommodity: (name, price, remainingNumber, CategoryId, introduction, imageFile) => {
    return new Promise(async (resolve, reject) => {
      Commodity.create({
        name,
        price,
        remainingNumber, 
        CategoryId, 
        introduction, 
        image: await imgurUpload(imageFile),
      })
      .then(()=> resolve('成功新增商品'))
      .catch(err => reject(err))
    })
  },
  editCommodity: (id, name, price, remainingNumber, CategoryId, introduction, imageFile) => {
    return new Promise(async (resolve, reject) => {
      Commodity.update({
        name,
        price,
        remainingNumber, 
        CategoryId, 
        introduction, 
        image: await imgurUpload(imageFile),
      }, { where: { id }})
      .then(()=> resolve('成功修改商品資料'))
      .catch(err => reject(err))
    })
  }
}

module.exports = adminService