const router = require('express').Router()
const Footer = require('../models/Footer')

router.get('/', async (req, res) => {
  try {
    const footer = await Footer.find()
    res.status(200).json(footer)
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const field = req.body
  try {
    await Footer.updateOne({_id: id}, {field})
    res.status(200).json('updated successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router