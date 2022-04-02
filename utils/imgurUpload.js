const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const imgurUpload = (imageFile) => {
  return new Promise((resolve, reject) => {
    fs.readFile(imageFile.path, (err, data) => {
      if (err) reject(err)
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(imageFile.path, (err, img) => resolve(img.data.link))
    })
  })
}

module.exports = imgurUpload