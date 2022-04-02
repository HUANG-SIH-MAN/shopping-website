const { Commodity, Category } = require('../models')
const imgurUpload = require('../utils/imgurUpload')
const { sequelize } = require('../models')

const adminService = {
  addCommodity: async (name, price, remainingNumber, CategoryId, introduction, imageFile) => {
    return new Promise(async (resolve, reject) => {
      const t = await sequelize.transaction()
      try {
        const category =  await Category.findByPk(CategoryId, { attributes: ['id'], transaction: t })
        if (!category) throw new Error('輸入錯誤的商品類別')
        await Commodity.create({
          name,
          price,
          remainingNumber, 
          CategoryId, 
          introduction, 
          image: await imgurUpload(imageFile),
        }, { transaction: t })     
        await t.commit()
        return resolve('成功新增商品')
      } catch (err) {
        await t.rollback()
        return reject(err)
      }
    })
  },
  editCommodity: async (id, name, price, remainingNumber, CategoryId, introduction, imageFile) => {
    return new Promise(async (resolve, reject) => {
      const t = await sequelize.transaction()
      try {
        const category =  await Category.findByPk(CategoryId, { attributes: ['id'], transaction: t })
        if (!category) throw new Error('輸入錯誤的商品類別')
        const commodity =  await Commodity.findByPk(id, { attributes: ['id'], transaction: t })
        if (!commodity) throw new Error('輸入錯誤的商品Id')
        await Commodity.update({
          name,
          price,
          remainingNumber, 
          CategoryId, 
          introduction, 
          image: await imgurUpload(imageFile),
        }, { where: { id }, transaction: t })     
        await t.commit()
        return resolve('成功修改商品資料')
      } catch (err) {
        await t.rollback()
        return reject(err)
      }
    })
  },
  removedCommodity: (id) => {
    return new Promise((resolve, reject) => {
      Commodity.findByPk(id)
      .then(commodity => {
        if (!commodity) throw new Error('輸入錯誤的商品id，該商品不存在')
        commodity.update({ removed: true })
        return resolve('成功下架商品')
      })
      .catch(err => reject(err))
    })
  },
  undoRemovedCommodity: (id) => {
    return new Promise((resolve, reject) => {
      Commodity.findByPk(id)
      .then(commodity => {
        if (!commodity) throw new Error('輸入錯誤的商品id，該商品不存在')
        commodity.update({ removed: false })
        return resolve('成功上架商品')
      })
      .catch(err => reject(err))
    })
  },
  deleteCommodity: (id) => {
    return new Promise((resolve, reject) => {
      Commodity.findByPk(id)
      .then(commodity => {
        if (!commodity) throw new Error('輸入錯誤的商品id，該商品不存在')
        commodity.destroy()
        return resolve('成功刪除商品')
      })
      .catch(err => reject(err))
    })
  }
}

module.exports = adminService
