const router = require('express').Router()
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const paypal = require("@paypal/checkout-server-sdk")
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const nodemailer = require('nodemailer')
const shippedHtml = require('../views/shipped')
const pendingHtml = require('../views/pending')
const completedHtml = require('../views/completed')
const canceledHtml = require('../views/canceled')
const axios = require('axios')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAILPASS
  }
});

const Environment = paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)

router.get('/', async (req, res) => {
  const { page, search } = req.query
  const skip = (parseInt(page) - 1) * 8
  try {
    const users = await User.find({ name: { $regex: search || '', $options: 'i' } }, { _id: 1 })
    const usersIds = users.map(({ _id }) => _id)
    const orders = await Order.find({ user: { $in: usersIds } }).sort({ _id: -1 }).skip(skip).populate('user', { name: 1 })
    const count = await Order.find({ user: { $in: usersIds } }).count()
    res.status(200).json({ orders, count })
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/byuser', async (req, res) => {
  const { user, page } = req.query
  const skip = (parseInt(page) - 1) * 8
  try {
    const orders = await Order.find({ user }).sort({ _id: -1 }).limit(8).skip(skip)
    const count = await Order.find({ user }).count()
    res.status(200).json({ orders, count })
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.get('/one/:id', async (req, res) => {
  const { id } = req.params
  try {
    const order = await Order.findById(id).populate('orderItems.product', { name: 1, slug: 1 }).populate('user', { name: 1 })
    res.status(200).json(order)
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.put('/status/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const allStatus = ['pending', 'shipped', 'canceled', 'completed']
  const exist = allStatus.findIndex(ele => ele === status.toLowerCase())
  if (exist !== -1) {
    try {
      const order = await Order.findByIdAndUpdate(id, { status })
      const user = await User.findById(order.user, { email: 1 })
      let html = '';
      if (status.toLowerCase() === 'pending') {
        html = pendingHtml;
      } else if (status.toLowerCase() === 'shipped') {
        html = shippedHtml
      } else if (status.toLowerCase() === 'canceled') {
        html = canceledHtml
      } else {
        html = completedHtml
      }
      // await transporter.sendMail({
      //   from: '"Amr Wheab" <amr.wheab2020@gmail.com>',
      //   to: user.email,
      //   subject: "Update Order Status",
      //   html
      // });
      res.status(200).json('updated successfully')
    } catch (err) {
      console.log(err)
      res.status(400).json('some thing went wrong')
    }
  } else {
    res.status(400).json('some thing went wrong')
  }
})

router.post('/paypal', async (req, res) => {
  const { productsToOrder } = req.body
  const productsToOrderIds = productsToOrder.map(ele => ele.product)

  try {
    const products = await Product.find({ _id: { $in: productsToOrderIds } }, { price: 1 })
    let totalPrice = 0
    productsToOrder.map(ele => {
      const product = products.find(prod => prod._id === mongoose.Types.ObjectId(ele.product) || ele.product)
      totalPrice += product.price * ele.amount
    })

    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPrice,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: totalPrice,
              },
            },
          },
          items: productsToOrder.map(item => {
            const productPrice = products.find(prod => prod._id === mongoose.Types.ObjectId(item.product) || item.product).price
            return {
              name: item.product,
              unit_amount: {
                currency_code: "USD",
                value: productPrice,
              },
              quantity: item.amount,
            }
          }),
        },
      ],
    })

    const order = await paypalClient.execute(request)
    res.status(200).json({ id: order.result.id })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
})

router.post('/new', async (req, res) => {
  const { products, details, user, paid } = req.body
  try {
    const productsToOrderIds = products.map(ele => ele.product)
    const productsValues = await Product.find({ _id: { $in: productsToOrderIds } }, { price: 1, loc: 1 })
    let totalPrice = 0
    products.map(ele => {
      const product = productsValues.find(prod => prod._id === mongoose.Types.ObjectId(ele.product) || ele.product)
      totalPrice += product.price * ele.amount
    })

    const newOrder = new Order({
      orderItems: products,
      shippingAddress1: details.shippingAddress1,
      shippingAddress2: details.shippingAddress2,
      city: details.city,
      zip: details.zip,
      phone: details.phone,
      totalPrice,
      user,
      paid
    })

    rasProd = JSON.stringify(productsValues[0])
    // const raf = JSON.parse(rasProd).loc.raf
    // const pos = JSON.parse(rasProd).loc.pos

    // await axios.get(`http://192.168.1.100?raf=${raf}&pos=${pos}`)

    // const userForMail = await User.findById(user).select('email')
    await newOrder.save()
    // await transporter.sendMail({
    //   from: '"Amr Wheab" <amr.wheab2020@gmail.com>',
    //   to: userForMail.email,
    //   subject: "Add Order",
    //   html: pendingHtml
    // });
    res.status(200).json('ordered successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/stripe', async (req, res) => {
  const { products, details, user, token } = req.body
  try {
    const productsToOrderIds = products.map(ele => ele.product)
    const productsValues = await Product.find({ _id: { $in: productsToOrderIds } }, { price: 1 })
    let totalPrice = 0
    products.map(ele => {
      const product = productsValues.find(prod => prod._id === mongoose.Types.ObjectId(ele.product) || ele.product)
      totalPrice += product.price * ele.amount
    })

    stripe.charges.create({
      amount: parseInt(parseFloat(totalPrice.toFixed(2)) * 100),
      currency: "USD",
      source: token.id,
      description: "Warehouse charge"
    }, async (err, charge) => {
      if (err) {
        console.log(err)
        res.status(500).json('some thing went wrong')
      } else {
        const newOrder = new Order({
          orderItems: products,
          shippingAddress1: details.shippingAddress1,
          shippingAddress2: details.shippingAddress2,
          city: details.city,
          zip: details.zip,
          phone: details.phone,
          totalPrice,
          user,
          paid: true
        })

        await newOrder.save()
        // const userForMail = await User.findById(user).select('email')
        // await transporter.sendMail({
        //   from: '"Amr Wheab" <amr.wheab2020@gmail.com>',
        //   to: userForMail.email,
        //   subject: "Add Order",
        //   html: pendingHtml
        // });
        res.status(200).json('ordered successfully')
      }
    });

  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    await Order.deleteOne({ _id: id })
    res.status(200).json('deleted successfully')
  } catch (err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router