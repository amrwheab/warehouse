const router = require('express').Router()
const Product = require('../models/Product')
const path = require('path')
const fs = require('fs')

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page)
  const skip = (page - 1) * 8
  const { search } = req.query
  try {
    const products = await Product.find({ name: { $regex: search } }).limit(8).skip(skip).populate('category');
    const count = await Product.find({ name: { $regex: search } }).count()
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

router.post('/', async (req, res) => {
  const { name,
    description,
    brand,
    price,
    category,
    countInStock,
    isFeatured,
    images } = req.body
  try {
    const newProduct = new Product({
      name,
      description,
      brand,
      price,
      category,
      countInStock,
      isFeatured,
      images: images.map(img => ({ ...img, url: `${req.protocol}://${req.get('host')}/uploads/${img.url}` }))
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
      images: images.map(img => ({ ...img, url: `${req.protocol}://${req.get('host')}/uploads/${img.url}` }))
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