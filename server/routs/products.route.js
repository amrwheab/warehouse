const router = require('express').Router()
const Product = require('../models/Product')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {

    let fileExtention = '';
    for (let i = file.originalname.length-1; i >= 0; i--) {
      if (file.originalname[i] === '.'){
        break
      }
      fileExtention += file.originalname[i]
    }

    cb(null, Date.now() + '.' + fileExtention.split('').reverse().join(''))
  }
})

const upload = multer({ storage })

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products)
  } catch(err) {
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', upload.array('images', 10), async (req, res) => {
  const { name, 
          description, 
          richDescription, 
          brand, 
          price, 
          category, 
          countInStock, 
          isFeatured } = req.body
  try {
    const { imagesFiles } = req.files
    const images = imagesFiles.map(image => {
      return {
        
      }
    })
    `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  } catch(err) {
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router