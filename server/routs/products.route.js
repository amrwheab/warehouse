const router = require('express').Router()
const Product = require('../models/Product')
const path = require('path')
const fs = require('fs')

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products)
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
      images
    })
    await newProduct.save()
    res.status(200).json(newProduct)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

// router.put('/:id', upload.array('images', 10), async (req, res) => {
//   const {
//     name,
//     description,
//     brand,
//     price,
//     category,
//     countInStock,
//     isFeatured } = req.body
//   const { id } = req.params
//   try {
//     if (req.files[0]?.filename) {

//       const imagesFiles = req.files
//       const images = imagesFiles.map(image => {
//         return {
//           url: `${req.protocol}://${req.get('host')}/uploads/${image.filename}`,
//           color: image.originalname.split('.')[0]
//         }
//       })

//       const product = await Product.findByIdAndUpdate(id, {
//         name,
//         description,
//         brand,
//         price,
//         category,
//         countInStock,
//         isFeatured,
//         images
//       })

//       product.images?.map(image => {
//         const imageName = image?.url.split('/')[image?.url.split('/').length-1]
//         const fileTest = fs.existsSync(path.join(__dirname, '..', 'uploads', imageName))
//         if (fileTest) {
//           fs.unlinkSync(path.join(__dirname, '..', 'uploads', imageName))
//         }
//       })

//     } else {
//       await Product.updateOne({_id: id}, {
//         name,
//         description,
//         brand,
//         price,
//         category,
//         countInStock,
//         isFeatured
//       })
//     }

//     res.status(200).json('updated successfully')
//   } catch (err) {
//     console.log(err)
//     res.status(400).json('some thing went wrong')
//   }
// })

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const product = await Product.findByIdAndDelete(id)
    product.images?.map(image => {
      const imageName = image?.url.split('/')[image?.url.split('/').length-1]
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