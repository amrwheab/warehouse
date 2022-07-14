const router = require('express').Router()
const Message = require('../models/Message')

router.post('/', async (req, res) => {
  const { name, email, content } = req.body
  if (name && email && content) {
    try {
      const newMessage = new Message({name, email, content})
      await newMessage.save()
      res.status(200).json('your message is added')
    } catch (err) {
      console.log(err)
      res.status(400).json('some thing went wrong')
    }
  } else {
    res.status(400).json('some thing went wrong')
  }
})

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page)
  const skip = (page - 1) * 10
  try {
    const messages = await Message.find().sort({_id: -1}).skip(skip).limit(10)
    const count = await Message.count()
    res.status(200).json({messages, count})
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router