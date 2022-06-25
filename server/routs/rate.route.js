const router = require('express').Router()
const Rate = require('../models/Rate')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
  try {
    const { product, token } = req.body
    const rate = parseInt(req.body.rate)

    let userId = null;
    try {
      userId = jwt.verify(token, process.env.JWTSECRET)?.id
    } catch { }
    if (userId) {
      if (rate === 0) {
        await Rate.deleteOne({user: userId, product})
        return res.status(200).json('deleted successfully')
      }
      
      const oldRate = await Rate.findOne({user: userId, product})
      if (oldRate?.rate) {
        await Rate.updateOne({user: userId, product, rate})
        return res.status(200).json('updated successfully')
      }
      const newRate = new Rate({
        product,
        user: userId,
        rate
      })
      await newRate.save()
      res.status(200).json('added successfully')
    } else {
      res.status(400).json('some thing went wrong')
    }
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router