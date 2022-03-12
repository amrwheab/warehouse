const router = require('express').Router()
const Product = require('../models/Product')
const Category = require('../models/Category')

router.get('/', async (req, res) => {
  try {
    categoryPromise = Category.find()
    mobileProductPromise = Product.find({category: '61d000cb7097899c64ba1f3a' }).populate('category').limit(5)
    featureProductPromise = Product.find({isFeature: true}).limit(12)
    techProductPromise = Product.find({category: '622a1f69ce42576754bc9d62'}).limit(12)
    fashionProductPromise = Product.find({category: '622a3b28ce42576754bcb4e7'}).limit(12)
  
    const [ category, 
            mobileProduct, 
            featureProduct, 
            techProduct,
            fashionProduct] = await Promise.all([categoryPromise, 
                                              mobileProductPromise, 
                                              featureProductPromise, 
                                              techProductPromise,
                                              fashionProductPromise])


    res.status(200).json({category, mobileProduct, featureProduct, techProduct, fashionProduct})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router