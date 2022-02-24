const router = require('express').Router()
const Category = require('../models/Category')
const Product = require('../models/Product')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page)
  const skip = (page-1)*10
  const { search } = req.query
  try {
    const categories = await Category.find({name: {$regex: search}}).limit(8).skip(skip);
    const count = await Category.find({name: {$regex: search}}).count()
    res.status(200).json({categories, count})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/onecategory/:id', async (req, res) => {
  const { id } = req.params
  try {
    const category = await Category.findById(id)
    res.status(200).json(category)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', async (req, res) => {
  const {name, image, filters} = req.body
  if (filters.split(',').length>10) return res.status(400).json('some thing went wrong with filters')
  try {
    const newImage = `${req.protocol}://${req.get('host')}/uploads/${image.url}`
    const newCategory = new Category({name, image: newImage, filters: filters ? filters.split(',') : []})
    await newCategory.save()
    res.status(200).json('added successfully')
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/:id', async (req, res) => {
  const {id} = req.params
  const {name, image, filters} = req.body
  if (filters.split(',').length>10) return res.status(400).json('some thing went wrong with filters')
  try {
    const imageUrl = image.touched ? `${req.protocol}://${req.get('host')}/uploads/${image.url}` : image.url
    const category = await Category.findByIdAndUpdate(id, {name, image: imageUrl, filters: filters ? filters.split(',') : []})
    const imageName = category?.image.split('/')[category?.image.split('/').length-1]
    if (image.touched) {
      const fileTest = fs.existsSync(path.join(__dirname, '..', 'uploads', imageName))
      if (fileTest) {
        fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageName))
      }
    }
    res.status(200).json('updated successfully')
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params
  try {
    const prod = await Product.findOne({category: id})
    if (!prod?._id) {
      const category = await Category.findByIdAndDelete(id)
      const imageName = category?.image.split('/')[category?.image.split('/').length-1]
      const fileTest = fs.existsSync(path.join(__dirname, '..', 'uploads', imageName))
        if (fileTest) {
          fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageName))
        }
      res.status(200).json('deleted successfully')
    } else {
      res.status(400).json('the category must have no products')
    }
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router