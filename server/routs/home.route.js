const router = require('express').Router()
const Product = require('../models/Product')
const Category = require('../models/Category')
const Cart = require('../models/Cart')
const Like = require('../models/Like')
const Rate = require('../models/Rate')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const { token } = req.query
  let id = undefined;
  try {
    id = jwt.verify(token, process.env.JWTSECRET)?.id
  } catch {}
  try {
    const select = '_id name images price discount slug rating numReviews category dateCreated';
    categoryPromise = Category.find()
    mobileProductPromise = Product.find({category: '61d000cb7097899c64ba1f3a' }).populate('category').limit(5).select(select)
    featureProductPromise = Product.find({isFeatured: true}).limit(12).select(select).populate('category')
    techProductPromise = Product.find({category: '622a1f69ce42576754bc9d62'}).limit(12).select(select).populate('category')
    fashionProductPromise = Product.find({category: '622a3b28ce42576754bcb4e7'}).limit(12).select(select).populate('category')

    let [ category, 
            mobileProduct, 
            featureProduct, 
            techProduct,
            fashionProduct] = await Promise.all([categoryPromise, 
                                              mobileProductPromise, 
                                              featureProductPromise, 
                                              techProductPromise,
                                              fashionProductPromise])
      
      let cartProdIds = []
      let likeProdIds = []

      const poductsIds = [...mobileProduct, ...featureProduct, ...techProduct, ...fashionProduct].map(ele => (ele._id))
      if (id) {
        const cartProds = await Cart.find({user: id, product: {$in: poductsIds}})
        const likeProds = await Like.find({user: id, product: {$in: poductsIds}})
        cartProdIds = cartProds.map(cart => (cart.product.toString()))
        likeProdIds = likeProds.map(like => (like.product.toString()))
      }
      const rates = await Rate.find({product: {$in: poductsIds}})

    res.status(200).json({category, mobileProduct, featureProduct, techProduct, fashionProduct, cartProdIds, likeProdIds, rates})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router