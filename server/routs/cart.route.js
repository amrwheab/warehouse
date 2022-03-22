const router = require('express').Router()
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const User = require('../models/User')

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page)
  const skip = (page - 1) * 8
  const {user} = req.query
  try {
    const select = '_id name images price discount slug rating numReviews dateCreated'
    const cart = await Cart.find({user}).limit(8).skip(skip)
    .populate({path: 'product', select, populate: {path: 'category'}})
    const count = await Cart.count({user})
    const cartTotalPrice = await Cart.find({user}, {user: 0}).populate({path: 'product', select: 'price'})
    const totalPriceArray = cartTotalPrice.map((a) => (a.product?.price * a.amount))
    let totalPrice = 0
    if (totalPriceArray.length > 0) {
      totalPrice = totalPriceArray?.reduce((a,b) => a+b)
    }
    res.status(200).json({cart, count, totalPrice})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', async (req, res) => {
  const { user, product } = req.body
  
  try {
    const productValue = await Product.findById(product, {_id: 1})
    const userValue = await User.findById(user, {_id: 1})
    
    if (!productValue?._id || !userValue?._id) return res.status(400).json('some thing went wrong with values')
    const cart = await Cart.findOne({user, product})
    if (cart?._id) return res.status(400).json('Its already in cart')
    
    const newCart = new Cart({product, user, amount: 1})
    await newCart.save()
    
    res.status(200).json('added successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/addone', async (req, res) => {
  const { user, product } = req.body
  
  try {
    const oldCart = await Cart.findOne({user, product}).populate('product')
    if (oldCart.amount + 1 > oldCart.product.countInStock) {
      return res.status(400).json('amount is more than expected')
    }
    await Cart.updateOne({user, product}, {$inc: {amount: 1}})
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/minusone', async (req, res) => {
  const { user, product } = req.body
  
  try {
    const oldCart = await Cart.findOne({user, product}).populate('product')
    if (oldCart.amount - 1 === 0) {
      return res.status(400).json('amount invalid')
    }
    await Cart.updateOne({user, product}, {$inc: {amount: -1}})
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.delete('/', async (req, res) => {
  const { user, product } = req.query
  
  try {
    await Cart.deleteOne({user, product})
    res.status(200).json('deleted successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router