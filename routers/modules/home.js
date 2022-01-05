const express = require('express')
const router = express.Router()
const db = require('../../models')
const Commodity = db.Commodity

router.get('/',(req, res)=>{
    Commodity.findAll({ raw: true, nest: true } )
    .then(data => res.render('index', {data}))
    
})

module.exports = router