const db = require('../models')
const Cart = db.Cart
const Commodity = db.Commodity

const cartController = {
    cartListPage: (req, res) => {
        Cart.findAll({
            raw: true, nest: true,
            where: { userId: req.user.id},
            include: [ Commodity ]
        })
        .then(cart => {
            const totalAmount = cart.map(i => i.quantity * i.Commodity.price).reduce((a,b)=> a + b)
            return res.render('cart', { cart, totalAmount })
        })
    },
    addCommodity: (req, res) => {
        Cart.findOrCreate({
            where: { userId: req.user.id, commodityId: req.params.commodityId }, 
            defaults: { 
                userId: req.user.id, 
                commodityId: req.params.commodityId 
            } 
        })
        .then(()=> {
            req.flash('success', '成功將商品加入購物車!!')
            return res.redirect('back')
        })
    },
    removeCommodity: (req, res) => {
        Cart.destroy({ 
            where: { id: req.params.id } 
        })
        .then(() => {
            req.flash('success', '成功將商品移除!!')
            return res.redirect('back')
        })
    },
    addQuantity: (req, res) => {
        Cart.findByPk(req.params.id)
        .then(cart => {
            cart.increment({quantity: 1})
            return res.redirect('back')
        })
    },
    reduceQuantity: (req, res) => {
        Cart.findByPk(req.params.id)
        .then(cart => {
            if (cart.dataValues.quantity <= 1) {
                req.flash('error', '商品數量至少為1')
            } else {
                cart.decrement({quantity: 1}) 
            }
            return res.redirect('back')
        })
    }
}

module.exports = cartController