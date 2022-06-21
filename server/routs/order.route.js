const router = require('express').Router()
const Order = require('../models/Order')
const Product = require('../models/Product')
const paypal = require("@paypal/checkout-server-sdk")
const mongoose = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const Environment = paypal.core.SandboxEnvironment
const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
)

router.post('/paypal', async (req, res) => {
  const { productsToOrder } = req.body
  const productsToOrderIds = productsToOrder.map(ele => ele.product)
  
  try {
    const products = await Product.find({_id: {$in: productsToOrderIds}}, {price: 1})
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
  const {products, details, user, paid} = req.body
  try {
    const productsToOrderIds = products.map(ele => ele.product)
    const productsValues = await Product.find({_id: {$in: productsToOrderIds}}, {price: 1})
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
    
    await newOrder.save()
    res.status(200).json('ordered successfully')
  } catch(err) {
    console.log(err)
    res.status(400).json('some thing went wrong')
  }
})

router.post('/stripe', async (req, res) => {
  const {products, details, user, token} = req.body
  try {
    const productsToOrderIds = products.map(ele => ele.product)
    const productsValues = await Product.find({_id: {$in: productsToOrderIds}}, {price: 1})
    let totalPrice = 0
    products.map(ele => {
      const product = productsValues.find(prod => prod._id === mongoose.Types.ObjectId(ele.product) || ele.product)
      totalPrice += product.price * ele.amount
    })

    stripe.charges.create({
      amount: +totalPrice.toFixed(2)*100,
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
        res.status(200).json('ordered successfully')
      }
    });
    
  } catch(err) {
    res.status(400).json('some thing went wrong')
  }
})

module.exports = router