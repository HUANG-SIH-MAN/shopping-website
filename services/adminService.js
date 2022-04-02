const { Commodity } = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  addCommodity: (name, price, remainingNumber, CategoryId, introduction, imageFile) => {
    return new Promise((resolve, reject) => {
      fs.readFile(imageFile.path, (err, data) => {
        if (err) reject(err)
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(imageFile.path, (err, img) => {
          return Commodity.create({
            name,
            price,
            remainingNumber, 
            CategoryId, 
            introduction, 
            image: img.data.link,
          })
          .then(()=> resolve('成功新增商品'))
          .catch(err => reject(err))
        })
      })
    })
  }
}

module.exports = adminService