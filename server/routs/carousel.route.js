const router = require('express').Router()
const Carousel = require('../models/Carousel')

router.get('/', async (req, res) => {
  try {
    const carouselItems = await Carousel.find()
    res.status(200).json(carouselItems)
  } catch (err) {
    console.log(err)
    res.status(200).json('some thing went wrong')
  }
})

router.get('/single/:id', async (req, res) => {
  const {id} = req.params
  try {
    const carouselItems = await Carousel.findOne({_id: id})
    res.status(200).json(carouselItems)
  } catch (err) {
    console.log(err)
    res.status(200).json('some thing went wrong')
  }
})

router.post('/', async (req, res) => {
  const count = await Carousel.find().count()
  if (count >= 10) return res.status(400).json('carousal items max number is 10')
  const { title, content, image, action } = req.body
  try {
    const newCarouselItem = new Carousel({
      title,
      content,
      action,
      image: `http://localhost:3000/uploads/${image}`
    })
    await newCarouselItem.save()
    res.status(200).json('added successfully')
  } catch (err) {
    console.log(err)
    res.status(200).json('some thing went wrong')
  }
})

router.put('/:id', async (req, res) => {
  const { title, content, image, action } = req.body
  const { id } = req.params
  try {
    await Carousel.updateOne({_id: id}, {
      title,
      content,
      action,
      image: `http://localhost:3000/uploads/${image}`
    })
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(200).json('some thing went wrong')
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Carousel.deleteOne({_id: id})
    res.status(200).json('deleted successfully')
  } catch (err) {
    console.log(err)
    res.status(200).json('some thing went wrong')
  }
})

module.exports = router