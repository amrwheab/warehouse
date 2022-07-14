const router = require('express').Router()
const Subscriber = require('../models/Subscriber')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
});

router.post('/add', async (req, res) => {
  const {email} = req.body
  try {
    const userExist = await Subscriber.findOne({email})
    if (!userExist?.email) {
      const newSubscriber = new Subscriber({email})
      await newSubscriber.save()
      res.status(200).json('added successfully')
    } else {
      res.status(400).json('already exsist')
    }
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/sendmail', async (req, res) => {
  const {text} = req.body
  try {
    const emailsSub = await Subscriber.find()
    const emails = emailsSub.map(ele => ele.email)
    await transporter.sendMail({
        from: '"Amr Wheab" <amr.wheab2020@gmail.com>',
        to: emails,
        subject: "New Warehouse article",
        html: text
      });
    res.status(200).json('added successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router