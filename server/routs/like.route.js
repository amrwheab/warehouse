const router = require('express').Router()
const Like = require('../models/Like')
const Product = require('../models/Product')
const User = require('../models/User')
const Cart = require('../models/Cart')
const Rate = require('../models/Rate')

router.get('/', async (req, res) => {
  const {user} = req.query
  const page = parseInt(req.query.page)
  const skip = (page - 1) * 16
  const select = '_id name images price discount slug rating numReviews'
  try {
    const likes = await Like.find({user}).limit(16).skip(skip).populate({path: 'product', select})
    let cartProdIds = []
    const products = likes.map(like => (like.product))
    const poductsIds = products.map(ele => (ele._id))
    const cartProds = await Cart.find({user, product: {$in: poductsIds}})
    const rates = await Rate.find({product: {$in: poductsIds}})
    cartProdIds = cartProds.map(cart => (cart.product.toString()))
    res.status(200).json({likes, cartProdIds, rates})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/getcount', async (req, res) => {
  const {user} = req.query
  try {
    const count = await Like.count({user})
    res.status(200).json(count)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', async (req, res) => {
  const {product, user} = req.body
  try {
    const productValue = await Product.findById(product, {_id: 1})
    const userValue = await User.findById(user, {_id: 1})
    
    if (!productValue?._id || !userValue?._id) return res.status(400).json('some thing went wrong with values')
    const like = await Like.findOne({product, user})
    if (like?._id) {
      await Like.deleteOne({product, user})
      res.status(200).json({add: false})
    } else {
      const newLike = new Like({product, user})
      await newLike.save()
      res.status(200).json({add: true})
    }

  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router