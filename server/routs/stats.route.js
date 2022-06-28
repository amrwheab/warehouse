const router = require('express').Router()
const Product = require('../models/Product')
const Category = require('../models/Category')
const Order = require('../models/Order')
const User = require('../models/User')
const {getAllViews} = require('../index')

router.get('/', async (req, res) => {
  try {
    const productsCount = await Product.count()
    const categoriesCount = await Category.count()
    const ordersCount = await Order.count()
    const usersCount = await User.count()
    const orders = await Order.find().sort({_id: -1}).limit(8).populate({path: 'user', select: 'name'})
    const users = await User.find().sort({_id: -1}).limit(8)
    res.status(200).json({views: getAllViews(), productsCount, categoriesCount, ordersCount, usersCount, orders, users})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router