const db = require('../models')
const Cart = db.Cart

const cartController = {
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
    }
}

module.exports = cartController