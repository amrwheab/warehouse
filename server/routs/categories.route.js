const router = require('express').Router()
const Category = require('../models/Category')
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

const upload = multer({ storage: storage })

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories)
  } catch (err) {
    res.status(400).json('some thing went wrong')
  }
})

router.post('/', upload.single('image'), async (req, res) => {
  const {name} = req.body
  try {
    if (req.file) {
      const image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      const newCategory = new Category({name, image})
      await newCategory.save()
      res.status(200).json(newCategory)
    } else {
      res.status(400).json('some thing went wrong')
    }
  } catch(err) {
    res.status(400).json('some thing went wrong')
  }
})

router.put('/:id',  upload.single('image'), async (req, res) => {
  const {id} = req.params
  const {name} = req.body
  try {
    if (req.file) {
      const image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      await Category.updateOne({_id: id}, {name, image})
      res.status(200).json('updated successfully')
    } else {
      await Category.updateOne({_id: id}, {name})
      res.status(200).json('updated successfully')
    }
  } catch(err) {
    res.status(400).json('some thing went wrong')
  }
})

router.delete('/:id', async (req, res) => {
  const {id} = req.params
  try {
    await Category.deleteOne({_id: id})
    res.status(200).json('deleted successfully')
  } catch (err) {
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router