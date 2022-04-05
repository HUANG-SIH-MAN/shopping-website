const { User, Commodity, Category, OrderItem, sequelize } = require('../models')
const imgurUpload = require('../utils/imgurUpload')

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
        if (imageFile) {
          await Commodity.update({
            name,
            price,
            remainingNumber, 
            CategoryId, 
            introduction, 
            image: await imgurUpload(imageFile)
          }, { where: { id }, transaction: t })
        } else {
          await Commodity.update({
            name,
            price,
            remainingNumber, 
            CategoryId, 
            introduction, 
          }, { where: { id }, transaction: t })
        }   
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
    return new Promise(async(resolve, reject) => {
      try {
        const commodity = await Commodity.findByPk(id, { attributes: ['id']})
        if (!commodity) throw new Error('輸入錯誤的商品id，該商品不存在')
        const orderItem = await OrderItem.findOne({
          where: { commodityId: id}
        })
        if (orderItem) throw new Error('該商品已有消費者購買，無法刪除')
        commodity.destroy()
        return resolve('成功刪除商品')
      } catch (err) {
        return reject(err)
      }
    })
  },
  addCategory: (name) => {
    return new Promise((resolve, reject) => {
      Category.create({name})
      .then(() => resolve('成功新增商品類別'))
      .catch(err => reject(err))
    })
  },
  editCategory: (id, name) => {
    return new Promise((resolve, reject) => {
      Category.findByPk(id)
      .then(category => {
        if(!category) throw new Error('輸入錯誤的類別Id，該類別不存在')
        category.update({name})
        return resolve('成功修改商品類別')
      })
      .catch(err => reject(err))
    })
  },
  deleteCategory: (id) => {
    return new Promise(async(resolve, reject) => {
      try {
        const category = await Category.findByPk(id, { attributes: ['id']})
        if(!category) throw new Error('輸入錯誤的類別Id，該類別不存在')
        const commodity = await Commodity.findOne({where: { categoryId: id}})
        if(commodity) throw new Error('該類別已經有商品資料，不可以刪除')
        category.destroy()
        return resolve('成功刪除商品類別')
      } catch (err) {
        return reject(err)
      }
    })
  },
  userData: () => {
    return new Promise((resolve, reject) => {
      User.findAll({
        raw: true,
        nest: true,
        where: { isAdmin: false },
        group: 'User.id',
        attributes: {
          include: [
          [sequelize.literal('(SELECT COUNT (DISTINCT id) FROM Orders WHERE userId = User.id AND status = true)'), 'buyNumber'],
          [sequelize.literal('(SELECT SUM (totalAmount) FROM Orders WHERE userId = User.id AND status = true)'), 'totalAmount']
          ],
          exclude: ['password', 'isAdmin', 'createdAt', 'updatedAt']
        }
      })
      .then(user => resolve(user))
      .catch(err => reject(err))
    })
  }
}

module.exports = adminService
