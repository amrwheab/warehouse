const router = require('express').Router()
const Product = require('../models/Product')
const path = require('path')
const fs = require('fs')
const Cart = require('../models/Cart')
const Like = require('../models/Like')
const Rate = require('../models/Rate')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page)
  const skip = (page - 1) * 8
  const { search } = req.query
  try {
    const products = await Product.find({ name: { $regex: search, $options : 'i' } }).limit(8).skip(skip).populate('category');
    const count = await Product.find({ name: { $regex: search, $options : 'i' } }).count()
    res.status(200).json({ products, count })
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/oneproduct/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findById(id).populate('category');
    res.status(200).json(product)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/getbyslug/:slug', async (req, res) => {
  const { slug } = req.params
  const { token } = req.query
  let userId = null;
  try {
    userId = jwt.verify(token, process.env.JWTSECRET)?.id
  } catch {}
  try {
    const product = await Product.findOne({slug}).populate('category');
    let cart = 0;
    let liked = 0;
    if (userId) {
      const cartPromise = Cart.findOne({product: product.id, user: userId})
      const likePromise = Like.count({product: product.id, user: userId})
      const res = await Promise.all([cartPromise, likePromise])
      cart = res[0]
      liked = res[1]
    }
    const rate = await Rate.find({product: product._id})
    res.status(200).json({
      product,
      cart: cart?.amount > 0 ? cart.amount : 0,
      liked: liked > 0,
      rate,
      userId
    })
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/filters', async (req, res) => {
  const query = req.query
  const page = parseInt(query.page)
  const skip = (page - 1) * 16
  const { token } = req.query
  let userId = undefined;
  try {
    userId = jwt.verify(token, process.env.JWTSECRET)?.id
  } catch {}
  let brand = null
  let price = null
  let filters = null
  for (const key in query) {
    if (key === 'brand') { brand = query[key] }
    else if (key === 'price') { price = query[key]}
    else if (key !== 'category' && key!== 'page' && key!=='token') {
      filters = {}
      filters[key] = query[key]
    }
  }
  try {
    let body = {category: query.category}
    if (brand) {body['brand']=brand}
    if (price) {body['price']={$lt: parseFloat(price)}}
    if (filters) {
      for (const key in filters)
      body[`filters.${key}`]=filters[key]
    }
    const select = '_id name images price discount slug rating numReviews';
    const productsPromise = Product.find(body).limit(16).skip(skip).select(select)
    const countPromis = Product.find(body).count()
    const [products, count] = await Promise.all([productsPromise, countPromis])
    let cartProdIds = []
    let likeProdIds = []

    const poductsIds = products.map(ele => (ele._id))
      if (userId) {
        const cartProds = await Cart.find({user: userId, product: {$in: poductsIds}})
        const likeProds = await Like.find({user: userId, product: {$in: poductsIds}})
        cartProdIds = cartProds.map(cart => (cart.product.toString()))
        likeProdIds = likeProds.map(like => (like.product.toString()))
      }
      
    const rates = await Rate.find({product: {$in: poductsIds}})
    res.status(200).json({products, count, cartProdIds, likeProdIds, rates})
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/brands', async (req, res) => {
  const {category, brand} = req.query
  try {
    const brands = await Product.find({brand: {$regex: brand, $options: 'i'}, category}, {brand: 1}).limit(10)
    res.status(200).json(brands)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/avilablefilters', async (req, res) => {
  const {category, filters, filterKey} = req.query
  let body = {category};
  body[`filters.${filterKey}`]={$regex: filters, $options: 'i'}
  try {
    const fils = await Product.find(body, {[`filters.${filterKey}`]: 1}).limit(10)
    res.status(200).json(fils)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', async (req, res) => {
  const { name,
    description,
    brand,
    price,
    category,
    countInStock,
    isFeatured,
    images,
    filters } = req.body
  try {
    const newProduct = new Product({
      name,
      description,
      brand,
      price,
      category,
      countInStock,
      isFeatured,
      filters,
      images: images.map(img => ({ ...img, url: `http://localhost:3000/uploads/${img.url}` }))
    })
    await newProduct.save()
    res.status(200).json(newProduct)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/', async (req, res) => {
  const {
    id,
    name,
    description,
    brand,
    price,
    category,
    countInStock,
    isFeatured,
    filters,
    images } = req.body
  try {
    await Product.updateOne({ _id: id }, {
      name,
      description,
      brand,
      price,
      category,
      countInStock,
      isFeatured,
      filters,
      images: images.map(img => img.touched ? ({ ...img, url: `http://localhost:3000/uploads/${img.url}` }): img)
    })
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findByIdAndDelete(id)
    product.images?.map(image => {
      const imageName = image?.url.split('/')[image?.url.split('/').length - 1]
      const fileTest = fs.existsSync(path.join(__dirname, '..', 'uploads', imageName))
      if (fileTest) {
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageName))
      }
    })
    res.status(200).json('deleted successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router